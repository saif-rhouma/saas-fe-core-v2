import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, Divider, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

export const DiscountPercentageSchema = zod.object({
  percentage: zod
    .number()
    .min(1, { message: 'Discount Percentage is required!' })
    .min(1, { message: 'Discount Percentage must be between 1 and 100' })
    .max(100, { message: 'Discount Percentage must be between 1 and 100' }),
});

const OrderDiscountDialog = ({ discount, open, onClose, handler }) => {
  const methods = useForm({
    resolver: zodResolver(DiscountPercentageSchema),
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (payload) => {
    try {
      const { percentage } = payload;
      reset();
      handler(percentage);
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Discount Percentage</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 1, mt: 1 }}>
          <Field.Text fullWidth type="number" label="Percentage" name="percentage" />
        </DialogContent>
        <Divider sx={{ pt: 1, mt: 1 }} />
        <DialogActions>
          <Button type="submit" variant="contained">
            Confirm
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => {
              reset();
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
export default OrderDiscountDialog;
