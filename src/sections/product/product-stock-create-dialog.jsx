/* eslint-disable no-unsafe-optional-chaining */
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Stack, Avatar, Button, Divider, MenuItem, DialogActions } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

const StockProductCreationSchema = zod.object({
  product: zod.number().min(1, { message: 'Product is required!' }),
  quantity: zod.number().min(1, { message: 'Quantity number is required!' }),
});

const ProductStockCreateDialog = ({ productsList, open, onClose }) => {
  const defaultValues = {
    product: null,
    quantity: 1,
  };

  const methods = useForm({
    resolver: zodResolver(StockProductCreationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      addStockProduct(data);
    } catch (error) {
      console.log(error);
    }
  });

  const queryClient = useQueryClient();

  const { mutate: addStockProduct } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.stock.create, payload),
    onSuccess: async (id) => {
      toast.success('New Stock Has Been Created!');
      reset();
      onClose();
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products-stock'] });
    },
    onError: () => {},
  });

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Add Stock</DialogTitle>
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Stack direction="row" gap={2}>
            <Field.Select name="product" label="Product">
              {productsList
                ?.filter((prod) => prod?.stock === null)
                .map((prod) => (
                  <MenuItem key={prod?.id} value={prod?.id}>
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        alt={prod?.name}
                        src={CONFIG.site.serverFileHost + prod?.image}
                      />
                      <Box component="span">{prod?.name}</Box>
                    </Stack>
                  </MenuItem>
                ))}
            </Field.Select>
            <Field.Text type="number" label="Enter Quantity" name="quantity" />
          </Stack>
        </DialogContent>
        <Divider sx={{ pt: 1, mt: 1 }} />
        <DialogActions>
          <LoadingButton type="submit" variant="contained">
            Save
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
export default ProductStockCreateDialog;
