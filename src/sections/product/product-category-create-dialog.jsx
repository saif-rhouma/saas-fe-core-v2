/* eslint-disable radix */
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Alert, Button, Divider, Typography, DialogTitle, DialogActions } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { Upload } from 'src/components/upload';
import { Form, Field } from 'src/components/hook-form';

const ProductCategoryCreationSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string(),
});

const ProductCategoryCreateDialog = ({ productCategory, open, onClose, handler }) => {
  const defaultValues = {
    name: productCategory?.name || '',
    description: productCategory?.description || '',
    image: productCategory?.image,
  };

  const store = useRef(productCategory);

  // //! Upload Logic START
  const [file, setFile] = useState();

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    setFile(() => newFile);
  }, []);

  const handleDelete = () => {
    setFile(null);
  };

  const uploadConfig = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  const { mutate: handleUploadCategoryFile } = useMutation({
    mutationFn: (fileUpload) => axios.post(endpoints.files.upload, fileUpload, uploadConfig),
    onSuccess: async ({ data }) => {
      const { name: filename } = data;
      if (filename) {
        const { current: payload } = store;
        payload.image = filename;
        if (productCategory) {
          await handler({ id: productCategory.id, payload });
        } else {
          await handler(payload);
        }
      }
      return data;
    },
    onSettled: async () => {
      setFile(null);
      store.current = {};
    },
    onError: (err) => {
      console.log(err);
    },
  });
  // //! Upload Logic END

  useEffect(() => {
    if (productCategory) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategory]);

  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm({
    resolver: zodResolver(ProductCategoryCreationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data };
      if (file) {
        store.current = { ...payload };
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'Category');
        await handleUploadCategoryFile(formData);
      } else if (productCategory) {
        await handler({ id: productCategory.id, payload });
      } else {
        await handler(payload);
      }
      reset();
    } catch (error) {
      console.log(error);
      setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Add Category</DialogTitle>
      <Divider />
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack
            spacing={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
              md: 'repeat(1, 1fr)',
              lg: 'repeat(1, 1fr)',
            }}
          >
            <Field.Text fullWidth label="Category Name" name="name" sx={{ mt: 2 }} />
            <Field.Text
              label="Description"
              name="description"
              multiline
              rows={3}
              inputProps={{ maxLength: 250 }}
              sx={{ mt: 2 }}
            />
          </Stack>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Attachments</Typography>
            <Upload value={file} onDrop={handleDropSingleFile} onDelete={handleDelete} />
          </Stack>
        </DialogContent>
        <Divider sx={{ pt: 1, mt: 1 }} />
        <DialogActions>
          <LoadingButton type="submit" variant="contained">
            {productCategory ? 'Save Changes' : 'Save'}
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
export default ProductCategoryCreateDialog;
