/* eslint-disable no-unsafe-optional-chaining */
import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { Button, MenuItem, DialogTitle, DialogActions } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';
import { fCurrency } from 'src/utils/format-number';

import { Upload } from 'src/components/upload';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

const PaymentCreationSchema = zod.object({
  amount: zod.number().min(1, { message: 'Amount is required!' }),
  paymentDate: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
  paymentType: zod.string().min(1, { message: 'Payment Type is required!' }),
  description: zod.string(),
});

const PaymentEditDialog = ({ payment, open, onClose, handler }) => {
  const store = useRef(payment);
  //! Upload Logic START
  const [file, setFile] = useState();

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    setFile(() => newFile);
  }, []);

  const handleDelete = () => {
    setFile(null);
  };

  const queryClient = useQueryClient();
  const uploadConfig = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  const { mutate: handleUploadPaymentFile } = useMutation({
    mutationFn: (fileUpload) => axios.post(endpoints.files.upload, fileUpload, uploadConfig),
    onSuccess: async ({ data }) => {
      const { name: filename } = data;
      if (filename) {
        const { current: payload } = store;
        payload.attachments = filename;
        await handler({ id: payment.id, payload });
      }
      return data;
    },
    onSettled: async () => {
      setFile(null);
      store.current = {};
      await queryClient.invalidateQueries({ queryKey: ['payments-images'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //! Upload Logic END

  useEffect(() => {
    if (payment) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment]);

  const defaultValues = useMemo(
    () => ({
      // amount: payment?.amount || 0,
      paymentType: payment?.paymentType || '',
      paymentDate: payment?.paymentDate || dayjs(),
      description: payment?.description || '',
    }),
    [payment]
  );

  const methods = useForm({
    resolver: zodResolver(PaymentCreationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (payload) => {
    try {
      if (file) {
        store.current = { ...payload };
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'Payment');
        await handleUploadPaymentFile(formData);
      } else {
        await handler({ id: payment.id, payload });
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle>Edit Payment</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Divider />
          <Stack spacing={1} sx={{ pt: 1, pb: 1 }}>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Customer Name:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {payment?.customer?.name}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Order ID:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {payment?.ref}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Payment Date:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {fDate(payment?.paymentDate)}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Payment Type:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {payment?.paymentType}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Payment Amount:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {fCurrency(payment?.amount) || '-'}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={1} sx={{ pt: 1, pb: 1 }}>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Order Amount:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {fCurrency(payment?.order?.totalOrderAmount) || '-'}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Paid Amount:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {fCurrency(payment?.order?.orderPaymentAmount) || '-'}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={1} sx={{ pt: 2, pb: 2 }}>
            <Box display="flex">
              <Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
                Balance:
              </Typography>
              <Typography component="span" variant="subtitle1">
                {fCurrency(payment?.order?.totalOrderAmount - payment?.order?.orderPaymentAmount)}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ pt: 4, pb: 1 }}>
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
            >
              <Field.Text type="number" name="amount" label="Paid Amount" sx={{ flexGrow: 1 }} />

              <Field.Select name="paymentType" label="Payment Type">
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Transfer">Transfer</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
              </Field.Select>

              <Field.DatePicker name="paymentDate" label="Date" sx={{ flexGrow: 1 }} />
            </Box>
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Notes / Remarks</Typography>
                <Field.Text name="description" multiline rows={3} />
              </Stack>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Attachments</Typography>
                <Upload value={file} onDrop={handleDropSingleFile} onDelete={handleDelete} />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" variant="contained">
            {payment ? 'Save Changes' : 'Save'}
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
export default PaymentEditDialog;
