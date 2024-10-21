import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import { StaffCreateView } from 'src/sections/staff/view/staff-create-view';
// ----------------------------------------------------------------------

const metadata = { title: `Create a new user | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const response = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.permissions.list);
      return data;
    },
  });

  const responsePG = useQuery({
    queryKey: ['permissions-groups'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.permissionsGroup.list);
      return data;
    },
  });

  if (responsePG.isLoading || response.isLoading) {
    return <LoadingScreen />;
  }
  if (response.isError || responsePG.isError) {
    return <ErrorBlock route={paths.dashboard.staff.root} />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StaffCreateView appPermissions={response.data} appPermissionsGroup={responsePG.data} />
    </>
  );
}
