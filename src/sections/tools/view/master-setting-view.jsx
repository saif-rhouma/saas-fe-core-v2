import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import MasterSettingEditForm from '../master-setting-edit-form';

const MasterSettingView = ({ applicationAccount, financial }) => (
  <DashboardContent>
    <CustomBreadcrumbs
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Settings', href: paths.dashboard.tools.root },
        { name: 'Master Settings' },
      ]}
      sx={{ mb: { xs: 3, md: 5 } }}
    />

    <MasterSettingEditForm applicationAccount={applicationAccount} financial={financial} />
  </DashboardContent>
);

export default MasterSettingView;
