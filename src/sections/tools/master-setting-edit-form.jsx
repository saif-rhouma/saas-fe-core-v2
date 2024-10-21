import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { Box, Card, Stack, Button, MenuItem, Typography } from '@mui/material';

import { fData } from 'src/utils/format-number';
import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Upload, UploadAvatar } from 'src/components/upload';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { CURRENCY_SYMBOL_KEY } from 'src/auth/context/jwt';

export const MasterAccountSchema = zod.object({
  name: zod.string().min(1, { message: 'Staff First Name is required!' }),
  description: zod.string(),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  currencySymbol: zod.string().min(1, { message: 'Staff Last Name is required!' }),
  taxPercentage: zod.number().min(1, { message: 'Staff Last Name is required!' }),
  // financialYear: zod.number().min(1, { message: 'Financial Year is required!' }),
  country: zod.string().min(1, { message: 'Country is required!' }),
  state: zod.string(),
  street: zod.string(),
  city: zod.string(),
  district: zod.string(),
  zipCode: zod.string(),
  taxNumber: zod.number(),
  printerPOS: zod.string().min(1, { message: 'Printer POS is required!' }),
});

const MasterSettingEditForm = ({ applicationAccount, financial }) => {
  const store = useRef(applicationAccount);

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (applicationAccount) {
      reset(defaultValues);
      setAvatarUrl(`${CONFIG.site.serverFileHost}${applicationAccount.favicon}`);
      setFile(`${CONFIG.site.serverFileHost}${applicationAccount.appLogo}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationAccount]);

  const defaultValues = useMemo(
    () => ({
      name: applicationAccount?.name || '',
      description: applicationAccount?.description || '',
      email: applicationAccount?.email || '',
      phoneNumber: applicationAccount?.phoneNumber || '',
      currencySymbol: applicationAccount?.currencySymbol || '',
      taxPercentage: applicationAccount?.taxPercentage || '',
      // financialYear: applicationAccount?.financialYear?.id || '',
      country: applicationAccount?.address?.country || '',
      state: applicationAccount?.address?.state || '',
      city: applicationAccount?.address?.city || '',
      district: applicationAccount?.address?.district || '',
      zipCode: applicationAccount?.address?.zipCode || '',
      street: applicationAccount?.address?.street || '',
      // taxNumber: applicationAccount?.taxNumber || 0,
      printerPOS: applicationAccount?.printerPOS || '',
    }),
    [applicationAccount]
  );

  const methods = useForm({
    resolver: zodResolver(MasterAccountSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.city || data.country || data.district || data.state || data.street || data.zipCode) {
        const { country, state, city, district, zipCode, street } = data;
        data.address = { country, state, city, district, zipCode, street };
        delete data.city;
        delete data.country;
        delete data.district;
        delete data.state;
        delete data.street;
        delete data.zipCode;
      }
      store.current = { ...data };
      if (avatarUrl && file) {
        const formAvatarData = new FormData();
        formAvatarData.append('file', avatarUrl);
        formAvatarData.append('category', 'AppAvatar');
        const formLogoData = new FormData();
        formLogoData.append('file', file);
        formLogoData.append('category', 'AppLogo');
        await handleUploadMultipleFilesSequence({ avatar: formAvatarData, logo: formLogoData });
      } else if (avatarUrl) {
        const formData = new FormData();
        formData.append('file', avatarUrl);
        formData.append('category', 'AppAvatar');
        await handleUploadFavIconFile(formData);
      } else if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'AppLogo');
        await handleUploadAppLogoFile(formData);
      } else {
        await handleEditAccount(data);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleDropAvatar = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    setAvatarUrl(newFile);
  }, []);

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

  const changeFavicon = useCallback((faviconPath) => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = faviconPath;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  const queryClient = useQueryClient();

  const { mutate: handleUploadFavIconFile } = useMutation({
    // eslint-disable-next-line no-shadow
    mutationFn: (file) => axios.post(endpoints.files.upload, file, uploadConfig),
    onSuccess: async ({ data }) => {
      const { name: filename } = data;
      if (filename) {
        const { current: payload } = store;
        payload.favicon = filename;
        changeFavicon(`${CONFIG.site.serverFileHost}${filename}`);
        await handleEditAccount(payload);
      }
      return data;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appAvatar-images'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: handleUploadAppLogoFile } = useMutation({
    // eslint-disable-next-line no-shadow
    mutationFn: (file) => axios.post(endpoints.files.upload, file, uploadConfig),
    onSuccess: async ({ data }) => {
      const { name: filename } = data;
      if (filename) {
        const { current: payload } = store;
        payload.appLogo = filename;
        await handleEditAccount(payload);
      }
      return data;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appAvatar-images'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: handleUploadMultipleFilesSequence } = useMutation({
    mutationFn: async ({ avatar, logo }) => {
      const avatarRes = await axios.post(endpoints.files.upload, avatar, uploadConfig);
      const logoRes = await axios.post(endpoints.files.upload, logo, uploadConfig);
      return { avatarRes, logoRes };
    },
    onSuccess: async ({ avatarRes, logoRes }) => {
      const avatarFilename = avatarRes?.data?.name;
      const logoFilename = logoRes?.data?.name;
      const { current: payload } = store;
      if (logoFilename) {
        payload.appLogo = logoFilename;
      }
      if (avatarFilename) {
        payload.favicon = avatarFilename;
      }
      changeFavicon(`${CONFIG.site.serverFileHost}${avatarFilename}`);
      await handleEditAccount(payload);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appAvatar-images'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: handleEditAccount } = useMutation({
    mutationFn: (payload) => axios.patch(endpoints.master.edit, payload),
    onSuccess: async () => {
      toast.success('Master Account Has Been Modified!');
      const { currencySymbol } = store.current;
      localStorage.setItem(CURRENCY_SYMBOL_KEY, currencySymbol);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['account-application'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ mb: 4 }}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Organization Details
          </Typography>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="name" label="Organization Name" />
            <Field.Phone name="phoneNumber" label="Phone number" />
            <Field.Text name="email" label="Email address" />
            <Field.Text name="description" label="Description" />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Attachments</Typography>
              <Upload value={file} onDrop={handleDropSingleFile} onDelete={handleDelete} />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Favicon</Typography>
              <UploadAvatar
                value={avatarUrl}
                onDrop={handleDropAvatar}
                validator={(fileData) => {
                  if (fileData.size > 1000000) {
                    return {
                      code: 'file-too-large',
                      message: `File is larger than ${fData(1000000)}`,
                    };
                  }
                  return null;
                }}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Stack>
          </Box>
        </Stack>
      </Card>
      <Card sx={{ mb: 4 }}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Finance Setting
          </Typography>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="currencySymbol" label="Currency Symbol" />
            <Field.Text name="taxPercentage" label="Tax Percentage" />
            {/* <Field.Select
              name="financialYear"
              label="Select a Financial Year"
              sx={{ width: 420, textTransform: 'capitalize' }}
            >
              {financial.map((fYear) => (
                <MenuItem key={fYear?.id} value={fYear?.id}>
                  {fYear?.year}
                </MenuItem>
              ))}
            </Field.Select> */}
          </Box>
        </Stack>
      </Card>
      <Card sx={{ mb: 4 }}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Firm Address
          </Typography>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />
            <Field.Text name="state" label="State/region" />
            <Field.Text name="city" label="City" />
            <Field.Text name="district" label="District" />
            <Field.Text name="zipCode" label="Zip/code" />
            <Field.Text name="street" label="Address" />
            <Field.Text type="number" name="taxNumber" label="Store Tax Number" />
          </Box>
        </Stack>
      </Card>
      <Card sx={{ mb: 4 }}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Other Settings
          </Typography>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.Select
              name="printerPOS"
              label="Printer POS"
              sx={{ width: 420, textTransform: 'capitalize' }}
            >
              <MenuItem value="A4">A4</MenuItem>
              <MenuItem value="Thermal">Thermal</MenuItem>
            </Field.Select>
          </Box>
        </Stack>
      </Card>
      <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
        <Button type="submit" variant="contained">
          Save Changes
        </Button>
        <Button variant="outlined">Cancel</Button>
      </Box>
    </Form>
  );
};
export default MasterSettingEditForm;
