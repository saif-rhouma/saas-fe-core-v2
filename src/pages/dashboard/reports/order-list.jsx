import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import ReportsOrderListView from 'src/sections/reports/view/reports-order-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Reports list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const response = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.order.list);
      return data;
    },
  });

  if (response.isPending || response.isLoading) {
    return <LoadingScreen />;
  }

  if (response.isError) {
    return <ErrorBlock route={paths.dashboard.reports.root} />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReportsOrderListView orders={response.data} />
    </>
  );
}
