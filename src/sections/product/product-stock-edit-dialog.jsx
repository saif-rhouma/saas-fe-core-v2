/* eslint-disable no-unsafe-optional-chaining */
import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Stack, Avatar, Button, Divider, DialogActions } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

const StockProductEditSchema = zod.object({
  quantity: zod.number().min(0, { message: 'Quantity number is required!' }),
});

const ProductStockEditDialog = ({ stock, open, onClose }) => {
  const defaultValues = {
    quantity: stock?.quantity || 0,
  };

  const methods = useForm({
    resolver: zodResolver(StockProductEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      editStockProduct({ id: stock?.id, payload: data });
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (stock) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock]);

  const queryClient = useQueryClient();

  const { mutate: editStockProduct } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.stock.edit + id, payload),
    onSuccess: async () => {
      toast.success('Stock Has Been Modified!');
      onClose();
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products-stock'] });
    },
    onError: () => {},
  });

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Edit Stock</DialogTitle>
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Stack direction="row" gap={2}>
            <Stack fullWidth flex={1} spacing={2} direction="row" alignItems="center">
              <Avatar
                sx={{ width: 24, height: 24 }}
                alt={stock?.name}
                src={CONFIG.site.serverFileHost + stock?.image}
              />
              <Box component="span">{stock?.name}</Box>
            </Stack>
            <Box>
              <Field.Text type="number" label="Enter Quantity" name="quantity" />
            </Box>
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
export default ProductStockEditDialog;
