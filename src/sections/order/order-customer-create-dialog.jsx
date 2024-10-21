import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Button, DialogTitle, DialogActions } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

const CustomerCreationSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  city: zod.string(),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  // phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  taxNumber: zod.number().min(1, { message: 'Tax number is required!' }),
  address: zod.string(),
  isActive: zod.boolean(),
});

function OrderCustomerCreateDialog({ customer, open, onClose, handler }) {
  const defaultValues = {
    name: customer?.name || '',
    city: customer?.address.city || '',
    email: customer?.email || '',
    phoneNumber: customer?.phoneNumber || '',
    taxNumber: parseInt(customer?.taxNumber, 10) || '',
    address: customer?.address?.street || '',
    isActive: customer?.isActive || true,
  };
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm({
    resolver: zodResolver(CustomerCreationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (customer) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data };
      delete payload.city;
      payload.address = { country: data.city, city: data.city, street: data.address };
      payload.taxNumber = payload.taxNumber.toString();
      if (customer) {
        await handler({ id: customer.id, payload });
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
      <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
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
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)',
            }}
          >
            <Field.Text fullWidth label="Enter Customer Name" name="name" sx={{ mt: 2 }} />
            <Field.Text label="Enter The City" name="city" sx={{ mt: 2 }} />
            <Field.Phone name="phoneNumber" label="Phone number" sx={{ mt: 2 }} />
            <Field.Text label="Enter Email Address" type="email" name="email" sx={{ mt: 2 }} />
            <Field.Text type="number" label="Enter Tax Number" name="taxNumber" sx={{ mt: 2 }} />
            <Field.Text label="Enter Address" name="address" multiline rows={3} sx={{ mt: 2 }} />

            <Field.Switch name="isActive" label="Is Active?" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" variant="contained">
            {customer ? 'Save Changes' : 'Save'}
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

export default OrderCustomerCreateDialog;
