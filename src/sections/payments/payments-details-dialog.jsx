/* eslint-disable no-unsafe-optional-chaining */
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { Button, DialogTitle, DialogActions } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { calculateAfterTax } from 'src/utils/helper';

const PaymentDetailsDialog = ({ payment, open, onClose }) => (
  <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
    <DialogTitle>Payment Details</DialogTitle>
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
            {payment?.order?.ref}
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
            {/* {fCurrency(payment?.order?.totalOrderAmount) || '-'} */}
            {fCurrency(
              calculateAfterTax(
                payment?.order.totalOrderAmount -
                  payment?.order.totalOrderAmount * (payment?.order.discount / 100),
                payment?.order?.snapshotTaxPercentage
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
            {/* {fCurrency(payment?.order?.totalOrderAmount - payment?.order?.orderPaymentAmount)} */}
            {fCurrency(
              calculateAfterTax(
                payment?.order.totalOrderAmount -
                  payment?.order.totalOrderAmount * (payment?.order.discount / 100),
                payment?.order?.snapshotTaxPercentage
              ) - payment?.order.orderPaymentAmount
            ) || '-'}
          </Typography>
        </Box>
      </Stack>
      <Divider />
    </DialogContent>
    <DialogActions>
      <Button color="inherit" variant="outlined" onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
export default PaymentDetailsDialog;
