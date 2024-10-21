import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PlanNewEditForm } from '../plan-new-edit-form';

export function PlanCreateView({ products }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new Plan"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Plan', href: paths.dashboard.plan.root },
          { name: 'Add Plan' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PlanNewEditForm products={products} />
    </DashboardContent>
  );
}
