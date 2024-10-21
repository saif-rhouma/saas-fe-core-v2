import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StaffNewEditForm } from '../staff-new-edit-form';

// ----------------------------------------------------------------------

export function StaffCreateView({ currentStaff, appPermissions, appPermissionsGroup }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Staff', href: paths.dashboard.staff.root },
          { name: 'New Staff' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StaffNewEditForm
        currentStaff={currentStaff}
        appPermissions={appPermissions}
        appPermissionsGroup={appPermissionsGroup}
      />
    </DashboardContent>
  );
}
