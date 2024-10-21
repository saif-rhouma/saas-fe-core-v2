import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ReportsPlanListView from 'src/sections/reports/view/reports-plan-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Reports list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReportsPlanListView />
    </>
  );
}
