import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { Button, DialogTitle, DialogActions } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import TicketsPreviousMessageDialog from './tickets-previous-message-dialog';

const TicketsDetailsDialog = ({ ticket, open, onClose }) => {
  const row = { status: 'completed' };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Ticket Details</DialogTitle>
      <DialogContent>
        <Divider />
        <Stack spacing={1} sx={{ pt: 1, pb: 1 }}>
          <Box display="flex">
            <Typography
              component="span"
              variant="body2"
              sx={{ flexGrow: 1, color: 'text.secondary' }}
            >
              Tichet ID:
            </Typography>
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              #01
            </Typography>
          </Box>
          <Box display="flex">
            <Typography
              component="span"
              variant="body2"
              sx={{ flexGrow: 1, color: 'text.secondary' }}
            >
              Members:
            </Typography>
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              Admin
            </Typography>
          </Box>
          <Box display="flex">
            <Typography
              component="span"
              variant="body2"
              sx={{ flexGrow: 1, color: 'text.secondary' }}
            >
              Topic:
            </Typography>
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              Hello There!!
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
              Ticket Status:
            </Typography>
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              <Label
                variant="soft"
                color={
                  (row.status === 'completed' && 'success') ||
                  (row.status === 'pending' && 'warning') ||
                  (row.status === 'cancelled' && 'error') ||
                  'default'
                }
              >
                {row.status}
              </Label>
            </Typography>
          </Box>
          <Box display="flex">
            <Typography
              component="span"
              variant="body2"
              sx={{ flexGrow: 1, color: 'text.secondary' }}
            >
              Ticket Priority:
            </Typography>
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              <Label
                variant="soft"
                color={
                  (row.status === 'completed' && 'success') ||
                  (row.status === 'pending' && 'warning') ||
                  (row.status === 'cancelled' && 'error') ||
                  'default'
                }
              >
                {row.status}
              </Label>
            </Typography>
          </Box>
        </Stack>
        <Divider />

        <TicketsPreviousMessageDialog
          customer={ticket?.customer}
          delivery={ticket?.delivery}
          payment={ticket?.payment}
          shippingAddress={ticket?.shippingAddress}
          history={ticket?.history}
        />

        <DialogActions>
          <Button variant="contained" startIcon={<Iconify icon="carbon:checkmark-filled" />}>
            Mark as Closed
          </Button>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
export default TicketsDetailsDialog;
