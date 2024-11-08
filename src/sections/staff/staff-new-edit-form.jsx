import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Box, Button, MenuItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// Schema definition for form validation
export const NewStaffSchema = zod.object({
  firstName: zod.string().min(1, { message: 'Staff firstName is required!' }),
  // lastName: zod.string().min(1, { message: 'Staff lastName is required!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(8, { message: 'Password must be at least 8 characters!' }),
  email: zod.string().min(1, { message: 'Email is required!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  permissions: zod.string().array().nonempty({ message: 'At least one permission is required!' }),
  isActive: zod.boolean(),
  permissionsGroup: zod.number(),
});

export function StaffNewEditForm({ currentStaff, appPermissions, appPermissionsGroup }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [permissions, setPermissions] = useState(appPermissions);

  const [isCustom, setIsCustom] = useState(false);

  const password = useBoolean();

  const defaultValues = useMemo(
    () => ({
      firstName: currentStaff?.firstName || '',
      lastName: currentStaff?.lastName || '',
      phoneNumber: currentStaff?.phoneNumber || '',
      email: currentStaff?.email || '',
      password: currentStaff?.password || '',
      isActive: currentStaff?.isActive === undefined ? true : currentStaff?.isActive,
      permissions: currentStaff?.permissions.map((per) => per.slug) || [],
      permissionsGroup: currentStaff?.permissionsGroup || null,
    }),
    [currentStaff]
  );

  const methods = useForm({
    resolver: zodResolver(NewStaffSchema),
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

  const values = watch();

  useEffect(() => {
    if (currentStaff) {
      reset(defaultValues);
    }
    if (appPermissions) {
      setPermissions(appPermissions);
    }
  }, [currentStaff, appPermissions, defaultValues, reset]);

  const { mutate: handleCreateStaff } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.staff.create, payload),
    onSuccess: () => {
      toast.success('New Staff has been created successfully!');
      // toast.success(
      //   currentStaff ? 'Staff updated successfully!' : 'New Staff created successfully!'
      // );
      queryClient.invalidateQueries(['staff']);
      reset();
      router.push(paths.dashboard.staff.root);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to save staff. Please try again.');
    },
  });

  const { mutate: handleEditStaff } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.staff.edit + id, payload),
    onSuccess: () => {
      toast.success('Staff updated successfully!');
      const { id } = currentStaff;
      queryClient.invalidateQueries(['staff', id]);
      reset();
      router.push(paths.dashboard.staff.root);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to edit staff. Please try again.');
    },
  });

  const onSubmit = handleSubmit(async (payload) => {
    if (payload.permissionsGroup !== 0) {
      delete payload.permissions;
    }
    try {
      if (currentStaff?.id) {
        const { id } = currentStaff;
        await handleEditStaff({ id, payload });
      } else {
        await handleCreateStaff(payload);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ mb: 4 }}>
        <Stack spacing={4} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Staff Details
          </Typography>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          >
            <Field.Text label="First Name" name="firstName" />
            {/* <Field.Text label="Last Name" name="lastName" /> */}
            <Field.Text label="Email" name="email" />
            <Field.Phone name="phoneNumber" label="Phone number" />
            <Field.Text
              name="password"
              label="Password"
              placeholder="8+ characters"
              type={password.value ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {appPermissionsGroup?.length > 0 && (
              <Field.Select
                name="permissionsGroup"
                label="Choose Permissions Group"
                sx={{ width: 420, textTransform: 'capitalize' }}
                onChange={(event) => {
                  const { value: id } = event.target;
                  if (id) {
                    const permsGroup = appPermissionsGroup.find((pg) => pg.id === id);
                    setValue(
                      'permissions',
                      permsGroup.permissions.map((per) => per.slug)
                    );
                    setValue('permissionsGroup', id);
                    setIsCustom(false);
                  }
                }}
              >
                {appPermissionsGroup.map((pg) => (
                  <MenuItem key={pg.id} value={pg.id}>
                    {`${pg?.name}`}
                  </MenuItem>
                ))}
                {isCustom && <MenuItem value={0}>Custom</MenuItem>}
              </Field.Select>
            )}
          </Box>
        </Stack>
      </Card>
      <Card sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
          Permissions
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
          <Field.MultiCheckbox
            name="permissions"
            onClick={() => {
              setIsCustom(true);
              setValue('permissionsGroup', 0);
            }}
            options={appPermissions.map((per) => ({ label: per.name, value: per.slug }))}
            sx={{
              display: 'grid',
              columnGap: 4,
              rowGap: 4,
              gridTemplateColumns: 'repeat(4, 1fr)',
            }}
          />
        </Box>
        {currentStaff && <Field.Switch name="isActive" label="Is Active?" />}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Submit
          </Button>
          <Button variant="outlined" onClick={() => reset()} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Card>
    </Form>
  );
}
