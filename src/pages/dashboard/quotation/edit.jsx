import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { LoadingScreen } from 'src/components/loading-screen';

import { ErrorBlock } from 'src/sections/error/error-block';
import { QuotationEditView } from 'src/sections/quotation/view/quotation-edit-view';
// ----------------------------------------------------------------------

const metadata = { title: `Quotation Edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const response = useQuery({
    queryKey: ['quotation', id],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.quotation.details + id);
      return data;
    },
  });

  const responseProduct = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get(endpoints.products.list);
      return res.data;
    },
  });

  const responseCustomers = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await axios.get(endpoints.customers.list);
      return res.data;
    },
  });

  const responseApplication = useQuery({
    queryKey: ['account-application'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.auth.application);
      return data;
    },
  });
  if (
    response.isLoading ||
    responseApplication.isLoading ||
    responseProduct.isLoading ||
    responseCustomers.isLoading
  ) {
    return <LoadingScreen />;
  }

  if (
    response.isError ||
    responseApplication.isError ||
    responseProduct.isError ||
    responseProduct.isError
  ) {
    return <ErrorBlock route={paths.dashboard.quotation.root} />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <QuotationEditView
        quotation={response.data}
        products={responseProduct.data}
        customers={responseCustomers.data}
        taxPercentage={responseApplication.data.taxPercentage}
      />
    </>
  );
}
