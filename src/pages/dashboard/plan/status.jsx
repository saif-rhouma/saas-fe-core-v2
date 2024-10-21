import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PlanStatusView } from 'src/sections/kanban/view/plan-status-view';
// ----------------------------------------------------------------------

const metadata = { title: `Plan Status | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PlanStatusView />
    </>
  );
}
