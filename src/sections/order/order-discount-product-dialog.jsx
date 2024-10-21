import { useState, useEffect } from 'react';

import {
  Button,
  Dialog,
  Divider,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

const OrderDiscountProductDialog = ({ product, discount, open, onClose, handler }) => {
  const [amount, setAmount] = useState(discount);
  useEffect(() => {
    setAmount(discount);
  }, [discount]);
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Discount Product : {product?.product?.name}</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 1, mt: 1 }}>
        <TextField
          fullWidth
          label="Discount Amount"
          type="number"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
        />
      </DialogContent>
      <Divider sx={{ pt: 1, mt: 1 }} />
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          onClick={() => {
            handler(product.index, amount);
          }}
        >
          Confirm
        </Button>
        <Button color="inherit" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default OrderDiscountProductDialog;
