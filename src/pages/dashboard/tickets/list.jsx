import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import TicketsListView from 'src/sections/tickets/view/tickets-list-view';
// ----------------------------------------------------------------------

const metadata = { title: `Tickets list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const response = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.tickets.list);
      return data;
    },
  });

  const responseAnalytics = useQuery({
    queryKey: ['tickets', 'analytics'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.tickets.analytics);
      return data;
    },
  });

  if (responseAnalytics.isLoading || response.isLoading) {
    return <LoadingScreen />;
  }
  if (response.isError || responseAnalytics.isError) {
    return <ErrorBlock route={paths.dashboard.tickets.root} />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <TicketsListView tickets={response.data} analytics={responseAnalytics} />
    </>
  );
}
