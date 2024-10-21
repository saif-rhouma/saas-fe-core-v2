import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import { PlanCreateView } from 'src/sections/plan/view/plan-create-view';

const metadata = { title: `Create a new Plan | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const responseProduct = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.products.list);
      return data;
    },
  });

  if (responseProduct.isLoading) {
    return <LoadingScreen />;
  }
  if (responseProduct.isError) {
    return <ErrorBlock route={paths.dashboard.products.root} />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PlanCreateView products={responseProduct.data} />
    </>
  );
}
