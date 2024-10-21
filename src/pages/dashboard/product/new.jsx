import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import { ProductCreateView } from 'src/sections/product/view';
// ----------------------------------------------------------------------

const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const response = useQuery({
    queryKey: ['products-images'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.products.productsImages);
      return data;
    },
  });

  const responseCat = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.productCategories.list);
      return data;
    },
  });

  if (responseCat.isLoading || response.isLoading) {
    return <LoadingScreen />;
  }
  if (response.isError || responseCat.isError) {
    return <ErrorBlock route={paths.dashboard.products.root} />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductCreateView productsImages={response.data} categories={responseCat.data} />
    </>
  );
}
