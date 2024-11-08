import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuotationEditForm } from '../quotation-edit-form';

export function QuotationEditView({ quotation, products, customers, taxPercentage }) {
  const headingText = `Edit Quotation: #${quotation.ref}`;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={headingText}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Quotation', href: paths.dashboard.quotation.root },
          { name: 'Edit Quotation' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <QuotationEditForm
        quotation={quotation}
        products={products}
        customers={customers}
        taxPercentage={taxPercentage}
      />
    </DashboardContent>
  );
}
