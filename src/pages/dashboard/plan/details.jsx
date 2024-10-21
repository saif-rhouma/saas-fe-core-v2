import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { PlanDetailsView } from 'src/sections/plan/view';
import { ErrorBlock } from 'src/sections/error/error-block';

// ----------------------------------------------------------------------

const metadata = { title: `Plan details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const response = useQuery({
    queryKey: ['plan', id],
    queryFn: async () => {
      const res = await axios.get(endpoints.plan.details + id);
      return res.data;
    },
  });

  if (response.isPending || response.isLoading) {
    return <LoadingScreen />;
  }

  if (response.isError) {
    return <ErrorBlock route={paths.dashboard.plan.root} />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PlanDetailsView currentPlan={response.data} />
    </>
  );
}
