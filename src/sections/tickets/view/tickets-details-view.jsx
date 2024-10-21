import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import OrderProductAddons from '../order-product-addons';
import { TicketDetailsItems } from '../tickets-details-item';
import TicketsPreviousMessage from '../tickets-previous-message';
// ----------------------------------------------------------------------

export function TicketDetailsView({ ticket }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tickets', href: paths.dashboard.tickets.root },
          { name: 'Ticket Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={9}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <TicketDetailsItems ticket={ticket} />
          </Stack>
        </Grid>

        <Grid xs={12} md={3}>
          <TicketsPreviousMessage ticket={ticket} messages={ticket?.messages} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
