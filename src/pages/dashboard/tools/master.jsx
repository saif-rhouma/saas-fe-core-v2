import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import MasterSettingView from 'src/sections/tools/view/master-setting-view';
// ----------------------------------------------------------------------

const metadata = { title: `Tools | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const response = useQuery({
    queryKey: ['account-application'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.auth.application);
      return data;
    },
  });

  // const responseFinancial = useQuery({
  //   queryKey: ['financial-year'],
  //   queryFn: async () => {
  //     const { data } = await axios.get(endpoints.financial.list);
  //     return data;
  //   },
  // });

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

      <MasterSettingView applicationAccount={response.data} />
    </>
  );
}
