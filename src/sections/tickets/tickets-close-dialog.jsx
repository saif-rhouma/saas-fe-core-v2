import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';

const TicketsCloseDialog = ({ open, onClose, handler }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <Stack spacing={1} alignItems="center">
        <Box />
        <strong>Are you sure?</strong>
        <p>Do you want to mark seleted ticket as closed.</p>
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button variant="contained" onClick={handler}>
        Confirm
      </Button>
      <Button color="inherit" variant="outlined" onClick={onClose}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);
export default TicketsCloseDialog;
