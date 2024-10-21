import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import ProductDetailsView from 'src/sections/product/view/product-details-view';

// ----------------------------------------------------------------------

const metadata = { title: `Product details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const response = useQuery({
    queryKey: ['plan', id],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.products.details + id);
      return data;
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

      <ProductDetailsView product={response.data} />
    </>
  );
}
