import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import PlanProductTable from './plan-product-table';

// ----------------------------------------------------------------------

export function PlanDetailsItems({ plan, handleViewOrder }) {
  return (
    <Card>
      <CardHeader title="Details" />
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          p: 3,
          typography: 'body2',
        }}
      >
        <Box
          flexDirection="column"
          sx={{
            display: 'flex',
            width: '100%',
            p: 1,
          }}
        >
          <Stack direction="row" sx={{ typography: 'subtitle2', marginBottom: 1 }}>
            <div>Plan Details</div>
          </Stack>
          <Box sx={{ color: 'text.secondary' }}>Plan ID: {plan?.ref}</Box>
          <Box sx={{ color: 'text.secondary' }}>Plan Date: {fDate(plan?.planDate)}</Box>
        </Box>
        <Box
          flexDirection="column"
          gap={0.5}
          sx={{
            display: 'flex',
            width: '100%',
            p: 1,
            borderRight: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
            borderLeft: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
          }}
        >
          <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ typography: 'subtitle2', width: '100%', marginBottom: 1 }}
          >
            <div>Laundry Saas POS</div>
          </Stack>
          <Box sx={{ color: 'text.secondary' }}>Quantity : {plan?.quantity}</Box>
        </Box>
        <Box
          flexDirection="column"
          alignItems="center"
          sx={{
            p: 1,
            display: 'flex',
            width: '100%',
          }}
        >
          <Stack
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ typography: 'subtitle2', width: '100%', marginBottom: 1 }}
          >
            <div>Plan Status</div>
            <Label
              variant="soft"
              color={
                (plan?.status === 'Ready' && 'success') ||
                (plan?.status === 'Pending' && 'info') ||
                (plan?.status === 'ProcessingA' && 'warning') ||
                (plan?.status === 'ProcessingB' && 'error') ||
                'default'
              }
            >
              {plan?.status}
            </Label>
          </Stack>
          {plan?.order?.id && (
            <Stack>
              <Button
                variant="contained"
                size="small"
                startIcon={<Iconify icon="heroicons-outline:external-link" />}
                onClick={() => {
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  const { id } = plan?.order;
                  if (id) {
                    handleViewOrder(id);
                  }
                }}
              >
                Related to Order: #{plan?.order?.ref}
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>

      <Scrollbar>
        <Box
          fullWidth
          alignItems="center"
          sx={{
            p: 3,
            borderBottom: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
          }}
        >
          <PlanProductTable products={plan?.product} quantity={plan?.quantity} />
        </Box>
      </Scrollbar>
    </Card>
  );
}
