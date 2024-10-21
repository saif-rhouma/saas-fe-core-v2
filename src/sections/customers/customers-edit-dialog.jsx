import OrderCustomerCreateDialog from '../order/order-customer-create-dialog';

function CustomerEditDialog({ customer, open, onClose, handler }) {
  return (
    <OrderCustomerCreateDialog
      customer={customer}
      open={open}
      onClose={onClose}
      handler={handler}
    />
  );
}

export default CustomerEditDialog;
