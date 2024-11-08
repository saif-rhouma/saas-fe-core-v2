import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Button, MenuItem, FormControlLabel } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import ProductItemButton from 'src/components/product/product-Item-button';

import ProductUploadImageDialog from './product-upload-image-dialog';
// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  price: zod.number().min(1, { message: 'Price should not be $0.00' }),
  description: zod.string(),
  categoryId: zod.number(),
  isActive: zod.boolean(),
});

// ----------------------------------------------------------------------

export function ProductNewEditForm({ currentProduct, productsImages, categories }) {
  const router = useRouter();

  const confirm = useBoolean();

  const dialog = useBoolean();

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      price: currentProduct?.price,
      images: currentProduct?.images || [],
      categoryId: currentProduct?.category?.id || null,
      isActive: currentProduct?.isActive === undefined ? true : currentProduct?.isActive,
    }),
    [currentProduct]
  );

  const [expanded, setExpanded] = useState(true);
  const [selectedDeletedImages, setSelectedDeletedImages] = useState([]);
  const [deletedAction, setDeleteAction] = useState(false);

  const [selectedImage, setSelectedImage] = useState();
  const [file, setFile] = useState();
  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
      setSelectedImage(currentProduct?.image);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (payload) => {
    try {
      if (selectedImage) {
        payload.image = selectedImage;
      }
      if (currentProduct?.id) {
        const { id } = currentProduct;
        await handleEditProduct({ id, payload });
      } else {
        await handleCreateProduct(payload);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    handleUploadProductImage(formData);
  };

  const handleSelectedImage = useCallback(
    (selected) => {
      if (selectedImage === selected) {
        setSelectedImage();
      } else {
        setSelectedImage(selected);
      }
    },
    [selectedImage]
  );

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    setFile(newFile);
  }, []);

  const handleDelete = () => {
    setFile(null);
  };

  const queryClient = useQueryClient();
  const uploadConfig = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  const { mutate: handleUploadProductImage } = useMutation({
    // eslint-disable-next-line no-shadow
    mutationFn: (file) => axios.post(endpoints.files.upload, file, uploadConfig),
    onSuccess: async () => {
      toast.success('New Image Has Been Uploaded!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products-images'] });
      setFile(null);
      dialog.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: handleCreateProduct } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.products.create, payload),
    onSuccess: async () => {
      toast.success('New Product Has Been Created!');
      reset();
      router.push(paths.dashboard.product.root);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      dialog.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: handleEditProduct } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.products.edit + id, payload),
    onSuccess: async () => {
      toast.success('Product Has Been Modified!');
      reset();
      router.push(paths.dashboard.product.root);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      dialog.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleDeleteImages = (payload) => {
    const objectExists = selectedDeletedImages.some((item) => item === payload);

    if (!objectExists) {
      const newData = [...selectedDeletedImages, payload];
      setSelectedDeletedImages(newData);
    } else {
      const newData = selectedDeletedImages.filter((item) => item !== payload);
      setSelectedDeletedImages(newData);
    }
  };

  const { mutate: deleteMultipleImages } = useMutation({
    mutationFn: (payload) => axios.delete(endpoints.files.deletes, payload),
    onSuccess: async () => {
      toast.success(`${selectedDeletedImages.length} has been deleted!`);
      await queryClient.invalidateQueries({ queryKey: ['products-images'] });
    },
    onSettled: () => {
      confirm.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
      <Card>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack
            spacing={4}
            sx={{ p: 3 }}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Box
              columnGap={2}
              rowGap={3}
              display="flex"
              flexDirection="column"
              // gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <Field.Text fullWidth label="Product Name" name="name" />
              <Field.Text
                label="Description"
                name="description"
                multiline
                rows={3}
                inputProps={{ maxLength: 250 }}
              />
              <Field.Text fullWidth type="number" label="Product Price" name="price" />
              {categories?.length > 0 && (
                <Field.Select
                  name="categoryId"
                  label="Category"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {`${cat?.name}`}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}

              {currentProduct && <Field.Switch name="isActive" label="Is Active?" />}
            </Box>

            <Box>
              {/* {currentProduct && currentProduct.image === selectedImage && (
                <Box
                  spacing={2}
                  gap={3}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', md: 'repeat(12, 1fr)' }}
                >
                  <ProductItemButton
                    image={CONFIG.site.serverFileHost + currentProduct.image}
                    handleClick={handleSelectedImage}
                    selected={currentProduct.image === selectedImage}
                  />
                </Box>
              )} */}
              <Box
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                }}
              >
                <Accordion
                  defaultExpanded={currentProduct}
                  expanded={expanded}
                  onChange={() => {
                    setExpanded(!expanded);
                  }}
                >
                  <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* <Typography>Select Icon</Typography> */}

                      {!deletedAction && (
                        <FormControlLabel
                          sx={{ ml: 1, mr: 1 }}
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setExpanded(true);
                                dialog.onToggle();
                              }}
                              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                            >
                              Upload Image
                            </Button>
                          }
                        />
                      )}

                      <FormControlLabel
                        sx={{ ml: 1, mr: 1 }}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={(event) => {
                              setDeleteAction(true);
                              setExpanded(true);
                              if (selectedDeletedImages.length > 0) {
                                confirm.onToggle();
                              }
                            }}
                            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          >
                            {deletedAction
                              ? selectedDeletedImages.length > 0
                                ? `Deletes ${selectedDeletedImages.length} Images`
                                : 'Select Image(s)'
                              : 'Delete'}
                          </Button>
                        }
                      />

                      {deletedAction && (
                        <FormControlLabel
                          sx={{ ml: 1, mr: 1 }}
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={
                            <Button
                              variant="outlined"
                              color="warning"
                              startIcon={<Iconify icon="ooui:cancel" />}
                              onClick={() => {
                                setDeleteAction(false);
                                setSelectedDeletedImages([]);
                              }}
                            >
                              Cancel Deletion
                            </Button>
                          }
                        />
                      )}
                    </Box>
                  </AccordionSummary>

                  <Divider />
                  <AccordionDetails>
                    <Box
                      spacing={2}
                      gap={3}
                      display="grid"
                      gridTemplateColumns={{ xs: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' }}
                    >
                      {productsImages.map((img) => (
                        <ProductItemButton
                          image={CONFIG.site.serverFileHost + img.name}
                          handleClick={handleSelectedImage}
                          handleDelete={handleDeleteImages}
                          payload={img.name}
                          selected={img.name === selectedImage}
                          deletedAction={deletedAction}
                          deletedImages={selectedDeletedImages}
                        />
                      ))}
                      {/* <ProductItemButton
                        image={`${CONFIG.site.basePath}/assets/upload-img.png`}
                        handleClick={() => dialog.onToggle()}
                      /> */}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </Stack>
          <Box
            spacing={4}
            sx={{ p: 3 }}
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            justifyContent="center"
          >
            <Box display="flex" gap={2} height={50}>
              <LoadingButton type="submit" variant="contained">
                Save
              </LoadingButton>
              <Button variant="outlined">Cancel</Button>
            </Box>
          </Box>
        </Form>
      </Card>
      <ProductUploadImageDialog
        open={dialog.value}
        onClose={dialog.onFalse}
        file={file}
        handleUpload={handleUpload}
        handleDrop={handleDropSingleFile}
        handleDelete={handleDelete}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${selectedDeletedImages.length} Images?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              const payload = {
                files: selectedDeletedImages,
              };
              deleteMultipleImages({ data: payload });
              setSelectedDeletedImages([]);
              setDeleteAction(false);
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
