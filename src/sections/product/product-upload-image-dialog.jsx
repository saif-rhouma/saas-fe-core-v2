import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
  Dialog,
  Divider,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { Upload } from 'src/components/upload';

const ProductUploadImageDialog = ({
  open,
  onClose,
  handleDrop,
  handleUpload,
  handleDelete,
  file,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Upload Product Image</DialogTitle>
    <Divider />
    <DialogContent sx={{ p: 1 }}>
      <Stack spacing={1}>
        <Upload value={file} onDrop={handleDrop} onDelete={handleDelete} />
      </Stack>
    </DialogContent>
    <DialogActions>
      <LoadingButton type="submit" variant="contained" onClick={handleUpload}>
        Upload
      </LoadingButton>
      <Button color="inherit" variant="outlined" onClick={onClose}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);
export default ProductUploadImageDialog;
