import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OrderStatusView } from 'src/sections/kanban/view/order-status-view';
// ----------------------------------------------------------------------

const metadata = { title: `Order Status | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderStatusView />
    </>
  );
}
