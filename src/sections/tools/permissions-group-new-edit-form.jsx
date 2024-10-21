import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// Schema definition for form validation
export const NewStaffSchema = zod.object({
  name: zod.string().min(1, { message: 'Staff firstName is required!' }),
  permissionsList: zod
    .string()
    .array()
    .nonempty({ message: 'At least one permission is required!' }),
  description: zod.string(),
});

export function PermissionsGroupNewEditForm({ currentPermission, appPermissions }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [permissions, setPermissions] = useState(appPermissions);

  const defaultValues = useMemo(
    () => ({
      name: currentPermission?.name || '',
      description: currentPermission?.description || '',
      permissionsList: currentPermission?.permissions.map((per) => per.slug) || [],
    }),
    [currentPermission]
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

  useEffect(() => {
    if (currentPermission) {
      reset(defaultValues);
    }
    if (appPermissions) {
      setPermissions(appPermissions);
    }
  }, [currentPermission, appPermissions, defaultValues, reset]);

  const { mutate: handleCreatePG } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.permissionsGroup.create, payload),
    onSuccess: () => {
      toast.success('New Permissions Group has been created successfully!');
      queryClient.invalidateQueries(['permissions-groups']);
      reset();
      router.push(paths.dashboard.tools.permissions);
    },
    onError: (err) => {
      console.error(err);
      // toast.error('Failed to save staff. Please try again.');
    },
  });

  const { mutate: handleEditPG } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.permissionsGroup.edit + id, payload),
    onSuccess: () => {
      toast.success('Permissions Group updated successfully!');
      const { id } = currentPermission;
      queryClient.invalidateQueries(['permissions-Group', id]);
      reset();
      router.push(paths.dashboard.tools.permissions);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to edit Permissions Group. Please try again.');
    },
  });

  const onSubmit = handleSubmit(async (payload) => {
    try {
      if (currentPermission?.id) {
        const { id } = currentPermission;
        await handleEditPG({ id, payload });
      } else {
        await handleCreatePG(payload);
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
            Permissions Group Details
          </Typography>
          <Box
            columnGap={2}
            rowGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          >
            <Field.Text label="Name" name="name" />
            <Field.Text
              label="Description"
              name="description"
              multiline
              rows={3}
              inputProps={{ maxLength: 250 }}
            />
          </Box>
        </Stack>
      </Card>
      <Card sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
          Permissions
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
          <Field.MultiCheckbox
            name="permissionsList"
            options={appPermissions.map((per) => ({ label: per.name, value: per.slug }))}
            sx={{
              display: 'grid',
              columnGap: 4,
              rowGap: 4,
              gridTemplateColumns: 'repeat(4, 1fr)',
            }}
          />
        </Box>
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
