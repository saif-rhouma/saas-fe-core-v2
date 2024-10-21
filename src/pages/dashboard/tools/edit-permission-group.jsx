import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import { PermissionsGroupCreateView } from 'src/sections/tools/view/permissions-group-create-view';
// ----------------------------------------------------------------------

const metadata = { title: `Permissions Group edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const response = useQuery({
    queryKey: ['permissions-group', id],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.permissionsGroup.details + id);
      return data;
    },
  });

  const responsePermissions = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.permissions.list);
      return data;
    },
  });

  if (responsePermissions.isLoading || response.isLoading) {
    return <LoadingScreen />;
  }
  if (response.isError || responsePermissions.isError) {
    return <ErrorBlock route={paths.dashboard.staff.root} />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <PermissionsGroupCreateView
        currentPermission={response.data}
        appPermissions={responsePermissions.data}
      />
    </>
  );
}
