import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OrderNewEditForm } from '../order-new-edit-form';

export function OrderCreateView({ products, customers, taxPercentage }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new Order"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Order', href: paths.dashboard.order.root },
          { name: 'Add Order' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <OrderNewEditForm products={products} customers={customers} taxPercentage={taxPercentage} />
    </DashboardContent>
  );
}
