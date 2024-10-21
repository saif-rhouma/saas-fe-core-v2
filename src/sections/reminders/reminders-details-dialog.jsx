import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { Button, DialogTitle, DialogActions } from '@mui/material';

const PaymentDetailsDialog = ({ payment, open, onClose }) => (
  <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
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
            Third co.
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
            ORD-6239
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
            26/06/2024
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
            26/06/2024
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
            SR 4,631.00
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
            SR 4,631.00
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
            SR 4,631.00
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
