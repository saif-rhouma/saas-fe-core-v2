import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Alert, Button, Divider, DialogTitle, DialogActions } from '@mui/material';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

const ProductAddonCreationSchema = zod.object({
  year: schemaHelper.date({ message: { required_error: 'Year is required!' } }),
  startDate: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
  endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),
});

const FinancialCreateDialog = ({ financial, open, onClose, handler }) => {
  const defaultValues = {
    year: financial?.year || dayjs(),
    startDate: financial?.startDate || dayjs(),
    endDate: financial?.endDate || dayjs(),
  };

  useEffect(() => {
    if (financial) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [financial]);

  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm({
    resolver: zodResolver(ProductAddonCreationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data };
      payload.year = dayjs(payload.year).format('YYYY');
      if (financial) {
        await handler({ id: financial.id, payload });
      } else {
        await handler(payload);
      }
      reset();
    } catch (error) {
      console.log(error);
      setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Add Financial</DialogTitle>
      <Divider />
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack
            spacing={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(1, 1fr)',
              lg: 'repeat1, 1fr)',
            }}
          >
            <Field.DatePicker
              views={['year']}
              format="YYYY"
              label="Year"
              name="year"
              sx={{ mt: 2 }}
            />
            <Field.DatePicker fullWidth label="Start Date" name="startDate" sx={{ mt: 2 }} />
            <Field.DatePicker fullWidth label="End Date" name="endDate" sx={{ mt: 2 }} />
          </Stack>
        </DialogContent>
        <Divider sx={{ pt: 1, mt: 1 }} />
        <DialogActions>
          <LoadingButton type="submit" variant="contained">
            {financial ? 'Save Changes' : 'Save'}
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
export default FinancialCreateDialog;
