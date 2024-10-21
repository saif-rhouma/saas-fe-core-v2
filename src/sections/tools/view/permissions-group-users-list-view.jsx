import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PGUserTable from '../pg-user-table';
// ----------------------------------------------------------------------
function PermissionGroupUserListView({ permissionsGroup }) {
  const [pgDetails, setPgDetails] = useState(permissionsGroup);
  const queryClient = useQueryClient();

  const { mutate: deleteStaffFromPG } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.permissionsGroup.deleteUser + id),
    onSuccess: async ({ data }) => {
      toast.success('Delete success!');
      setPgDetails(data);
      await queryClient.invalidateQueries({ queryKey: ['permissions-group', permissionsGroup.id] });
    },
    onSettled: async () => {},
    onError: () => {},
  });

  useEffect(() => {
    setPgDetails(permissionsGroup);
  }, [permissionsGroup]);

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Tools', href: paths.dashboard.tools.root },
            { name: 'Permissions Groups', href: paths.dashboard.tools.permissions },
            { name: 'Permissions Group Details' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Grid container>
          <Grid xs={12} md={12}>
            <Card>
              <CardHeader title="Details" />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  p: 3,
                  typography: 'body2',
                }}
              >
                <Box
                  flexDirection="column"
                  sx={{
                    display: 'flex',
                    width: '100%',
                  }}
                >
                  <Box sx={{ color: 'text.secondary' }}>Name: {permissionsGroup?.name}</Box>
                  <Box sx={{ color: 'text.secondary' }}>
                    Description: {permissionsGroup?.description}
                  </Box>
                  <Box sx={{ color: 'text.secondary' }}>
                    Permissions: {permissionsGroup?.permissions.map((per) => per.name).join(', ')}.
                  </Box>
                </Box>
              </Stack>
              <CardHeader title="Users" />
              <Box
                fullWidth
                alignItems="center"
                sx={{
                  p: 3,
                }}
              >
                <PGUserTable users={pgDetails.staffs} onDeleteRow={deleteStaffFromPG} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </DashboardContent>
  );
}
export default PermissionGroupUserListView;
