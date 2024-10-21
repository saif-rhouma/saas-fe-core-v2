import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionsGroupNewEditForm } from '../permissions-group-new-edit-form';

// ----------------------------------------------------------------------

export function PermissionsGroupCreateView({ currentPermission, appPermissions }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Permissions Groups', href: paths.dashboard.staff.root },
          { name: 'New Permissions Group' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PermissionsGroupNewEditForm
        currentPermission={currentPermission}
        appPermissions={appPermissions}
      />
    </DashboardContent>
  );
}
