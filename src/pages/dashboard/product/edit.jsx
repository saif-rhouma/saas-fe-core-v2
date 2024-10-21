import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ProductEditView } from 'src/sections/product/view';
import { ErrorBlock } from 'src/sections/error/error-block';
// ----------------------------------------------------------------------

const metadata = { title: `Product edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const responseImages = useQuery({
    queryKey: ['products-images'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.products.productsImages);
      return data;
    },
  });

  const response = useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const res = await axios.get(endpoints.products.details + id);
      return res.data;
    },
  });

  const responseCat = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.productCategories.list);
      return data;
    },
  });

  if (response.isLoading || responseImages.isLoading || responseCat.isLoading) {
    return <LoadingScreen />;
  }

  if (response.isError || responseImages.isError || responseCat.isError) {
    return <ErrorBlock route={paths.dashboard.products.root} />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductEditView
        product={response.data}
        productsImages={responseImages.data}
        categories={responseCat.data}
      />
    </>
  );
}
