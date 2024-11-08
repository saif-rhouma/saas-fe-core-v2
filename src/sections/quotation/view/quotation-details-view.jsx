/* eslint-disable react/no-unknown-property */
import { useReactToPrint } from 'react-to-print';
/* eslint-disable no-unsafe-optional-chaining */
import { useRef, useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Tab,
  Card,
  Tabs,
  Button,
  Divider,
  Tooltip,
  CardHeader,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTabs } from 'src/hooks/use-tabs';
import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';
import { fCurrency } from 'src/utils/format-number';
import { PermissionsType } from 'src/utils/constant';
import { calculateTax, calculateAfterTax } from 'src/utils/helper';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';

import TicketsCreateDialog from 'src/sections/tickets/tickets-create-dialog';
import ReminderCreateDialog from 'src/sections/reminders/reminder-create-dialog';

import QuotationTicketsTable from '../quotation-ticket-table';
import QuotationProductTable from '../quotation-product-table';
import QuotationRemindersTable from '../quotation-reminder-table';
// ----------------------------------------------------------------------

const TABS = [
  { value: 'details', icon: <Iconify icon="solar:eye-bold" width={24} />, label: 'Details' },
  {
    value: 'tickets',
    icon: <Iconify icon="solar:case-minimalistic-bold" width={24} />,
    label: 'Tickets',
  },
  {
    value: 'reminders',
    icon: <Iconify icon="solar:calendar-bold" width={24} />,
    label: 'Reminders',
  },
];

export function QuotationDetailsView({ currentQuotation }) {
  const [quotation, setQuotation] = useState(currentQuotation);

  const basicTabs = useTabs('details');

  const contentToPrint = useRef();

  useEffect(() => {
    setQuotation(currentQuotation);
  }, [currentQuotation]);

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });

  const ticketCreateDialog = useBoolean();
  const reminderCreateDialog = useBoolean();

  const renderTotal = (
    <Stack
      alignItems="flex-end"
      sx={{ pr: 3, pl: 3, pb: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>
          {fCurrency(quotation?.totalAmount) || '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box sx={{ width: 160, ...(quotation?.discount && { color: 'error.main' }) }}>
          {quotation?.discount ? `- ${quotation?.discount}%` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Tax ({quotation?.snapshotTaxPercentage || '0'}%)</Box>
        <Box sx={{ width: 160 }}>
          {quotation?.snapshotTaxPercentage
            ? fCurrency(
                calculateTax(
                  quotation?.totalAmount - quotation?.totalAmount * (quotation?.discount / 100),
                  quotation?.snapshotTaxPercentage
                )
              )
            : '-'}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <div>Gross Total</div>
        <Box sx={{ width: 160 }}>
          {fCurrency(
            calculateAfterTax(
              quotation?.totalAmount - quotation?.totalAmount * (quotation?.discount / 100),
              quotation?.snapshotTaxPercentage
            )
          ) || '-'}
        </Box>
      </Stack>
    </Stack>
  );

  const detailsTab = (
    <Stack
      sx={{
        display: 'flex',
        flex: 1,
        pb: 3,
        pr: 3,
        pl: 3,
        typography: 'body2',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          m: 1,
        }}
      >
        <Box
          flexDirection="column"
          sx={{
            display: 'flex',
          }}
        >
          <Box sx={{ color: 'text.secondary' }}>Quotation Ref: #{quotation?.ref}</Box>
          <Box sx={{ color: 'text.secondary' }}>
            Quotation Date: {fDate(quotation?.quotationDate)}
          </Box>
        </Box>
        <Box
          sx={{
            mr: 2,
          }}
        >
          <Box sx={{ color: 'text.secondary' }}>
            Status:{' '}
            <Label
              variant="soft"
              color={
                (quotation?.status === 'InProcess' && 'warning') ||
                (quotation?.status === 'Confirmed' && 'success') ||
                (quotation?.status === 'Canceled' && 'error') ||
                'default'
              }
            >
              {quotation?.status}
            </Label>
          </Box>
        </Box>
        {quotation?.order?.id && (
          <Box sx={{ color: 'text.secondary' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon="heroicons-outline:external-link" />}
              onClick={() => {
                // eslint-disable-next-line no-unsafe-optional-chaining
                const { id } = quotation?.order;
                if (id) {
                  handleViewOrder(id);
                }
              }}
            >
              Related to Order: #{quotation?.order?.ref}
            </Button>
          </Box>
        )}
        {/* <Divider /> */}
      </Box>
      {quotation?.notes && (
        <Box>
          <Divider />
          <Stack
            sx={{
              typography: 'body2',
            }}
          >
            <Box
              sx={{
                p: 1,
              }}
            >
              <Stack sx={{ typography: 'subtitle2' }}>
                <div>Notes:</div>
                <Box sx={{ color: 'text.secondary' }}>{quotation?.notes}</Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Stack>
  );

  const productTab = (
    <>
      <Box
        sx={{
          pr: 3,
          pl: 3,
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <QuotationProductTable products={quotation?.productToQuotation} defaultRowsPerPage={10} />
      </Box>
      {renderTotal}
    </>
  );

  const ticketsTab = (
    <Stack
      sx={{
        display: 'flex',
        flex: 1,
        pb: 3,
        pr: 3,
        pl: 3,
        typography: 'body2',
      }}
    >
      <Box
        sx={{
          flex: 1,
          mt: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <QuotationTicketsTable tickets={quotation.tickets} />
      </Box>
    </Stack>
  );

  const remindersTab = (
    <Stack
      sx={{
        display: 'flex',
        flex: 1,
        pb: 3,
        pr: 3,
        pl: 3,
        typography: 'body2',
      }}
    >
      <Box
        sx={{
          flex: 1,
          mt: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <QuotationRemindersTable reminders={quotation?.reminders} />
      </Box>
    </Stack>
  );
  const router = useRouter();

  const handleEditQuotation = useCallback(
    (id) => {
      router.push(paths.dashboard.quotation.edit(id));
    },
    [router]
  );

  const handleViewOrder = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const queryClient = useQueryClient();

  const { mutate: handleCreateOrder } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.quotation.createOrder, payload),
    onSuccess: async ({ data }) => {
      toast.success('Order Has Been Created!');
      const { id } = quotation;
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
      await queryClient.invalidateQueries({ queryKey: ['quotation', id] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Quotation', href: paths.dashboard.quotation.root },
          { name: 'Quotation Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card ref={contentToPrint}>
            {/* Add some CSS to hide the title on screen and show it only in print */}
            <style jsx>{`
              .print-title {
                display: none; /* Hide on screen */
              }

              @media print {
                html,
                body {
                  height: initial !important;
                  overflow: initial !important;
                }
                .print-title {
                  display: block; /* Show only when printing */
                }
                .print-hide {
                  display: none; /* Hide on screen */
                }
                .print-padding {
                  padding: 60px;
                }
              }
            `}</style>
            <Stack direction={{ md: 'column', p: 3 }}>
              <CardHeader
                sx={{ pt: 1 }}
                title={quotation?.name}
                subheader={`Quotation for Customer : ${quotation?.customer?.name}`}
                action={
                  <Stack
                    className="print-hide"
                    spacing={3}
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-end', sm: 'center' }}
                    sx={{ mb: { xs: 3, md: 5 } }}
                  >
                    <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
                      <PermissionAccessController permission={PermissionsType.EDIT_QUOTATION}>
                        {quotation?.status === 'Draft' && (
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => {
                                handleEditQuotation(quotation?.id);
                              }}
                            >
                              <Iconify icon="solar:pen-bold" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </PermissionAccessController>
                      <PermissionAccessController
                        permission={PermissionsType.CONVERT_QUOTATION_TO_ORDER}
                      >
                        {!quotation?.order?.id && quotation?.status === 'Draft' && (
                          <Tooltip title="Convert to Order">
                            <IconButton
                              onClick={() => {
                                handleCreateOrder({ quotationId: quotation?.id });
                              }}
                            >
                              <Iconify icon="solar:restart-circle-bold" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </PermissionAccessController>
                      <PermissionAccessController permission={PermissionsType.PRINT_QUOTATION}>
                        <Tooltip title="Print">
                          <IconButton
                            onClick={() => {
                              basicTabs.setValue('details');
                              handlePrint();
                            }}
                          >
                            <Iconify icon="solar:printer-minimalistic-bold" />
                          </IconButton>
                        </Tooltip>
                      </PermissionAccessController>
                    </Stack>
                  </Stack>
                }
              />
              {detailsTab}
              <Divider sx={{ mt: 3 }} />
              <Tabs
                value={basicTabs.value}
                className="print-hide"
                onChange={basicTabs.onChange}
                sx={{
                  px: 3,
                  mb: 3,
                  // eslint-disable-next-line no-shadow
                  boxShadow: (theme) =>
                    `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                }}
              >
                {TABS.map((tab) => (
                  <Tab key={tab.value} icon={tab.icon} value={tab.value} label={tab.label} />
                ))}
                {basicTabs.value === 'tickets' && (
                  <Box
                    marginLeft="auto"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      onClick={() => ticketCreateDialog.onToggle()}
                      variant="outlined"
                      startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                      New Ticket
                    </Button>
                  </Box>
                )}

                {basicTabs.value === 'reminders' && (
                  <Box
                    marginLeft="auto"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      onClick={() => reminderCreateDialog.onToggle()}
                      variant="outlined"
                      startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                      New Reminder
                    </Button>
                  </Box>
                )}
              </Tabs>

              {basicTabs.value === 'details' && productTab}
              {basicTabs.value === 'tickets' && ticketsTab}
              {basicTabs.value === 'reminders' && remindersTab}
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <TicketsCreateDialog
        open={ticketCreateDialog.value}
        onClose={ticketCreateDialog.onFalse}
        quotation={quotation}
      />
      <ReminderCreateDialog
        open={reminderCreateDialog.value}
        onClose={reminderCreateDialog.onFalse}
        quotation={quotation}
      />
    </DashboardContent>
  );
}
