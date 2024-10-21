import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ProductListView } from 'src/sections/product/view';
import { ErrorBlock } from 'src/sections/error/error-block';
// ----------------------------------------------------------------------

const metadata = { title: `Product list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const response = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.products.list);
      return data;
    },
  });

  const responseApplication = useQuery({
    queryKey: ['account-application'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.auth.application);
      return data;
    },
  });

  if (responseApplication.isLoading || response.isLoading) {
    return <LoadingScreen />;
  }
  if (responseApplication.isError || response.isError) {
    return <ErrorBlock route={paths.dashboard.products.root} />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ProductListView
        products={response.data}
        taxPercentage={responseApplication.data.taxPercentage}
      />
    </>
  );
}
