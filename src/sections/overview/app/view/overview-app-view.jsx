import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { monthName } from 'src/utils/format-time';

import { _appFeatured } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { useAuthContext } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppNewInvoice } from '../app-new-invoice';
import { AppTopAuthors } from '../app-top-authors';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';

// ----------------------------------------------------------------------

export function OverviewAppView({ analytics }) {
  const { user } = useAuthContext();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.firstName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Waiting for Approval"
            total={analytics.orders.analytics.Draft}
            chart={{
              categories: analytics.orders.draftLastSixMonth.map((item) =>
                monthName(item?.inMonth)
              ),
              series: analytics.orders.draftLastSixMonth.map((item) => item?.ClaimsPerMonth),
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Processing Order"
            total={analytics.orders.analytics.InProcess}
            chart={{
              categories: analytics.orders.inProcessLastSixMonth.map((item) =>
                monthName(item?.inMonth)
              ),
              series: analytics.orders.inProcessLastSixMonth.map((item) => item?.ClaimsPerMonth),
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Ready to Deliver"
            total={analytics.orders.analytics.Ready}
            chart={{
              categories: analytics.orders.readyLastSixMonth.map((item) =>
                monthName(item?.inMonth)
              ),
              series: analytics.orders.readyLastSixMonth.map((item) => item?.ClaimsPerMonth),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Order Overview"
            // subheader="Downloaded by operating system"
            chart={{
              series: [
                { label: 'Ready', value: analytics.orders.analytics.Ready },
                { label: 'In Process', value: analytics.orders.analytics.InProcess },
                { label: 'Waiting for Approval', value: analytics.orders.analytics.Draft },
                { label: 'Delivered', value: analytics.orders.analytics.Delivered },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  name: '2022',
                  data: [
                    { name: 'Asia', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                    { name: 'Europe', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                    { name: 'Americas', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    { name: 'Asia', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                    { name: 'Europe', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                    { name: 'Americas', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                  ],
                },
                {
                  name: '2024',
                  data: [
                    { name: 'Asia', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Europe', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Americas', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="Top 5 Ordered Products By Quantity"
            tableData={analytics.products}
            headLabel={[
              { id: 'id', label: '#', width: 60 },
              { id: 'name', label: 'Product Name' },
              { id: 'price', label: 'Price' },
              { id: 'quantity', label: 'Total Quantity', width: 160 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top 5 Customers" list={analytics.customers} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
