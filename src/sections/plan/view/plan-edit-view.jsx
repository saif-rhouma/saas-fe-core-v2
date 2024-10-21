import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PlanNewEditForm } from '../plan-new-edit-form';

export function PlanEditView({ products, plan }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Plan"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Plan', href: paths.dashboard.plan.root },
          { name: 'Edit Plan' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PlanNewEditForm products={products} plan={plan} />
    </DashboardContent>
  );
}
