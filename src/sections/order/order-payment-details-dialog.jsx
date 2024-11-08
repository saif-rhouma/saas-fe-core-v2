import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { Button, MenuItem, DialogTitle, DialogActions } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';
import { fCurrency } from 'src/utils/format-number';
import { fDate, today } from 'src/utils/format-time';
import { calculateAfterTax } from 'src/utils/helper';

import { Iconify } from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

const PaymentCreationSchema = zod.object({
  amount: zod.number().min(1, { message: 'Amount is required!' }),
  paymentDate: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
  paymentType: zod.string().min(1, { message: 'Payment Type is required!' }),
});

const OrderPaymentDetailsDialog = ({ order, payment, open, onClose, handler }) => {
  const store = useRef(payment);

  // //! Upload Logic START
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
        await handler(payload);
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
  // //! Upload Logic END

  const defaultValues = {
    amount: 0,
    paymentType: '',
    paymentDate: today(),
  };
  const methods = useForm({
    resolver: zodResolver(PaymentCreationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data, orderId: order.id, customerId: order.customer.id };
      if (file) {
        store.current = { ...payload };
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'Payment');
        await handleUploadPaymentFile(formData);
      } else {
        await handler(payload);
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle>Add Payment</DialogTitle>
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
                {order.customer.name}
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
                {order.ref}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Order Date:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {fDate(order.orderDate)}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Delivery Date:
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {order.deliveryDate ? fDate(order.deliveryDate) : <span> - </span>}
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
                {/* {fCurrency(order.totalOrderAmount) || '-'} */}
                {fCurrency(
                  calculateAfterTax(
                    order.totalOrderAmount - order.totalOrderAmount * (order.discount / 100),
                    order?.snapshotTaxPercentage
                  )
                ) || '-'}
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
                {fCurrency(order.orderPaymentAmount) || '-'}
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
                {fCurrency(
                  calculateAfterTax(
                    order.totalOrderAmount - order.totalOrderAmount * (order.discount / 100),
                    order?.snapshotTaxPercentage
                  ) - order.orderPaymentAmount
                ) || '-'}
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
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text type="number" name="amount" label="Paid Amount" sx={{ flexGrow: 1 }} />
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
              <Box>
                <Field.Select name="paymentType" label="Payment Type">
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Transfer">Transfer</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                </Field.Select>
              </Box>
              <Stack spacing={1.5} flexDirection="row" sx={{ height: '56px' }}>
                {/* <Typography variant="subtitle2">Attachments</Typography> */}
                {/* <Upload
                  value={file}
                  onDrop={handleDropSingleFile}
                  onDelete={handleDelete}
                  sx={{ m: 0, p: 0 }}
                /> */}

                <UploadBox
                  onDrop={handleDropSingleFile}
                  // onDelete={handleDelete}
                  sx={{ height: 'auto' }}
                />
                {file && (
                  <Stack
                    flexDirection="row"
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      typography: 'body2',
                      color: 'error.main',
                      cursor: 'pointer',
                      border: `solid 1px rgba(0,0,0,0)`,
                      p: 1,
                      '&:hover': {
                        border: `solid 1px`,
                        borderColor: 'error.main',
                        borderRadius: 1.5,
                      },
                    }}
                    onClick={handleDelete}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    <Box>
                      <Box spacing={3}>
                        <Typography
                          component="span"
                          variant="subtitle2"
                          sx={{ flexGrow: 1, mr: 1 }}
                        >
                          Filename:
                        </Typography>
                        <span>{file.name}</span>
                      </Box>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" variant="contained">
            Save
          </LoadingButton>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => {
              reset();
              setFile(null);
              onClose();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
export default OrderPaymentDetailsDialog;
