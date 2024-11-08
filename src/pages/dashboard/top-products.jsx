import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import TopOrderedProductsView from 'src/sections/overview/app/view/top-ordered-products-view';

const metadata = { title: `Dashboard - ${CONFIG.site.name}` };
const TopProducts = () => {
  const response = useQuery({
    queryKey: ['top-products'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.topProducts);
      return data;
    },
  });

  if (response.isPending || response.isLoading) {
    return <LoadingScreen />;
  }

  if (response.isError) {
    return <ErrorBlock route="" />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <TopOrderedProductsView products={response.data} />
    </>
  );
};
export default TopProducts;
