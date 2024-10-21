import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import AccountSettingEditForm from '../account-setting-edit-form';

const AccountSettingView = ({ userAccount }) => (
  <DashboardContent>
    <CustomBreadcrumbs
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Settings', href: paths.dashboard.tools.root },
        { name: 'Account Settings' },
      ]}
      sx={{ mb: { xs: 3, md: 5 } }}
    />

    <AccountSettingEditForm userAccount={userAccount} />
  </DashboardContent>
);
export default AccountSettingView;
