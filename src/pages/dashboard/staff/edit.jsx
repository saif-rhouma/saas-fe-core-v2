import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import { StaffCreateView } from 'src/sections/staff/view/staff-create-view';
// ----------------------------------------------------------------------

const metadata = { title: `User edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const response = useQuery({
    queryKey: ['staff', id],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.staff.details + id);
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

  const responsePG = useQuery({
    queryKey: ['permissions-groups'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.permissionsGroup.list);
      return data;
    },
  });

  if (responsePermissions.isLoading || response.isLoading || responsePG.isLoading) {
    return <LoadingScreen />;
  }
  if (response.isError || responsePermissions.isError || responsePG.isError) {
    return <ErrorBlock route={paths.dashboard.staff.root} />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StaffCreateView
        currentStaff={response.data}
        appPermissions={responsePermissions.data}
        appPermissionsGroup={responsePG.data}
      />
    </>
  );
}
