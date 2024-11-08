import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Stack, Avatar, CardHeader } from '@mui/material';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { paths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductOrderTable from '../product-order-table';

const ProductDetailsView = ({ product }) => (
  <DashboardContent>
    <CustomBreadcrumbs
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Product', href: paths.dashboard.product.root },
        { name: 'Product Details' },
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
                sx={{
                  p: 1,
                  display: 'flex',
                }}
              >
                <Stack spacing={2} direction="row" alignItems="center">
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    alt={product?.name}
                    src={
                      CONFIG.site.serverFileHost +
                      (product?.image || CONFIG.site.defaultImgPlaceHolder)
                    }
                  />
                </Stack>
              </Box>

              <Box
                flexDirection="column"
                gap={1}
                sx={{
                  display: 'flex',
                  width: '100%',
                  p: 1,
                }}
              >
                <Stack
                  sx={{ color: 'text.secondary' }}
                  gap={1}
                  flexDirection="row"
                  alignItems="center"
                >
                  <span>Category:</span>
                  <Stack gap={1} flexDirection="row" alignItems="center">
                    <AvatarGroup
                      sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 24, height: 24 } }}
                    >
                      <Avatar
                        alt={product?.category?.name}
                        src={`${CONFIG.site.serverFileHost}${product?.category?.image}`}
                      />
                    </AvatarGroup>
                    {product?.category?.name}
                  </Stack>
                </Stack>
                <Box sx={{ color: 'text.secondary' }}>Name: {product?.name}</Box>
                <Box sx={{ color: 'text.secondary' }}>Description: {product?.description}</Box>
                <Box sx={{ color: 'text.secondary' }}>
                  Price:
                  <Label variant="soft" color="info">
                    {fCurrency(product?.price)}
                  </Label>
                </Box>
              </Box>
            </Stack>
            {product?.productToOrder.length > 1 && (
              <Scrollbar>
                <Box
                  fullWidth
                  alignItems="center"
                  sx={{
                    p: 3,
                    borderBottom: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
                  }}
                >
                  <ProductOrderTable
                    productOrders={product?.productToOrder}
                    defaultRowsPerPage={15}
                  />
                </Box>
              </Scrollbar>
            )}
          </Card>
        </Stack>
      </Grid>
    </Grid>
  </DashboardContent>
);
export default ProductDetailsView;
