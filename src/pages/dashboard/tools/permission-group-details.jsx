import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import PermissionGroupUserListView from 'src/sections/tools/view/permissions-group-users-list-view';
// ----------------------------------------------------------------------

const metadata = { title: `Permissions Group Details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const response = useQuery({
    queryKey: ['permissions-group', id],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.permissionsGroup.details + id);
      return data;
    },
  });

  if (response.isLoading) {
    return <LoadingScreen />;
  }
  if (response.isError) {
    return <ErrorBlock route={paths.dashboard.tools.root} />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <PermissionGroupUserListView permissionsGroup={response.data} />
    </>
  );
}
