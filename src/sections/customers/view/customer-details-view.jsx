import Grid from '@mui/material/Unstable_Grid2';
import { Box, Tab, Card, Tabs, Stack, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { SvgColor } from 'src/components/svg-color';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CustomerOrdersTable from '../customer-orders-table';
import CustomerProductsTable from '../customer-products-table';

const CustomerDetailsView = ({ payload }) => {
  const TABS = [
    {
      value: 'products',
      icon: <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/ic-product.svg`} />,
      label: 'Products',
    },
    {
      value: 'orders',
      icon: <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/ic-order.svg`} />,
      label: 'Orders',
    },
  ];

  const { customer, products } = payload;
  const basicTabs = useTabs('products');

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
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      // eslint-disable-next-line no-shadow
                      boxShadow: (theme) =>
                        `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                    }}
                  >
                    <Tabs
                      value={basicTabs.value}
                      onChange={basicTabs.onChange}
                      sx={{
                        pr: 3,
                        pl: 3,
                      }}
                    >
                      {TABS.map((tab) => (
                        <Tab key={tab.value} icon={tab.icon} value={tab.value} label={tab.label} />
                      ))}
                    </Tabs>
                  </Box>

                  {basicTabs.value === 'products' && (
                    <Scrollbar>
                      <Box
                        fullWidth
                        alignItems="center"
                        sx={{
                          pr: 3,
                          pl: 3,
                          pb: 3,
                          pt: 1,
                          borderBottom: (theme) =>
                            `dashed 2px ${theme.vars.palette.background.neutral}`,
                        }}
                      >
                        <CustomerProductsTable products={products} defaultRowsPerPage={15} />
                      </Box>
                    </Scrollbar>
                  )}
                  {basicTabs.value === 'orders' && (
                    <Scrollbar>
                      <Box
                        fullWidth
                        alignItems="center"
                        sx={{
                          pr: 3,
                          pl: 3,
                          pb: 3,
                          pt: 1,
                          borderBottom: (theme) =>
                            `dashed 2px ${theme.vars.palette.background.neutral}`,
                        }}
                      >
                        <CustomerOrdersTable orders={customer.orders} defaultRowsPerPage={15} />
                      </Box>
                    </Scrollbar>
                  )}
                </Box>
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
};
export default CustomerDetailsView;
