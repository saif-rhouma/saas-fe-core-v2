import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Stack, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CustomerProductsTable from '../customer-products-table';

const CustomerDetailsView = ({ payload }) => {
  const { customer, products } = payload;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Customer', href: paths.dashboard.customers.root },
          { name: 'Customer Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <Card>
              <CardHeader title="Details" />
              <Stack
                direction="row"
                gap={10}
                // justifyContent="space-between"
                sx={{
                  p: 3,
                  typography: 'body2',
                }}
              >
                <Box
                  flexDirection="column"
                  gap={1}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    p: 1,
                  }}
                >
                  <Box sx={{ color: 'text.secondary' }}>Ref: #{customer?.ref}</Box>
                  <Box sx={{ color: 'text.secondary' }}>Name: {customer?.name}</Box>
                  <Box sx={{ color: 'text.secondary' }}>Email: {customer?.email}</Box>
                  {customer?.phoneNumber && (
                    <Box sx={{ color: 'text.secondary' }}>
                      Phone Number: {customer?.phoneNumber || ' - '}
                    </Box>
                  )}
                  {customer?.taxNumber && (
                    <Box sx={{ color: 'text.secondary' }}>
                      Tax Number: {customer?.taxNumber || ' - '}
                    </Box>
                  )}
                </Box>
              </Stack>

              <Scrollbar>
                <Box
                  fullWidth
                  alignItems="center"
                  sx={{
                    p: 3,
                    borderBottom: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
                  }}
                >
                  <CustomerProductsTable products={products} />
                </Box>
              </Scrollbar>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
};
export default CustomerDetailsView;
