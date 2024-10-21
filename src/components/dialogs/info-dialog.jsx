import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

const InfoDialog = ({ dialog, title, contentText }) => (
  <Dialog open={dialog.value} onClose={dialog.onFalse}>
    <DialogTitle>{title}</DialogTitle>

    <DialogContent sx={{ color: 'text.secondary' }}>
      <p>{contentText}</p>
    </DialogContent>
    <DialogActions>
      <Button variant="contained" onClick={dialog.onFalse} autoFocus>
        Okay
      </Button>
    </DialogActions>
  </Dialog>
);
export default InfoDialog;
