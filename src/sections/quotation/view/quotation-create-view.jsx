import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuotationNewEditForm } from '../quotation-new-edit-form';

export function QuotationCreateView({ products, customers, taxPercentage }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new quotation"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Quotation', href: paths.dashboard.quotation.root },
          { name: 'Add Quotation' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <QuotationNewEditForm
        products={products}
        customers={customers}
        taxPercentage={taxPercentage}
      />
    </DashboardContent>
  );
}
