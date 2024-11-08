/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unsafe-optional-chaining */
import { useTheme } from '@emotion/react';
import { useReactToPrint } from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import IconButton from '@mui/material/IconButton';
import {
  Box,
  Tab,
  Card,
  Tabs,
  NoSsr,
  Stack,
  Button,
  Divider,
  Tooltip,
  CardHeader,
  CircularProgress,
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

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';

import { ErrorBlock } from '../error/error-block';
import QuotationTicketsTable from './quotation-ticket-table';
import QuotationProductTable from './quotation-product-table';
import QuotationRemindersTable from './quotation-reminder-table';
import TicketsCreateDialog from '../tickets/tickets-create-dialog';
import ReminderCreateDialog from '../reminders/reminder-create-dialog';

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

const QuotationDetailCard = ({ selectedQuotation, handleResize, handleClose }) => {
  const [quotation, setQuotation] = useState(selectedQuotation);

  const response = useQuery({
    queryKey: ['quotation', quotation.id],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.quotation.details + quotation.id);
      setQuotation(data);
      return data;
    },
  });

  useEffect(() => {
    if (selectedQuotation.id !== quotation.id) {
      setQuotation(selectedQuotation);
    }
  }, [quotation.id, selectedQuotation]);

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

  const basicTabs = useTabs('details');

  const renderDownload = (
    <NoSsr>
      <PDFDownloadLink
        // document={
        //   invoice ? <InvoicePDF invoice={invoice} currentStatus={currentStatus} /> : <span />
        // }
        // fileName={invoice?.invoiceNumber}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <Tooltip title="Download">
            <IconButton>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Iconify icon="eva:cloud-download-fill" />
              )}
            </IconButton>
          </Tooltip>
        )}
      </PDFDownloadLink>
    </NoSsr>
  );

  const renderTotal = (
    <Stack alignItems="flex-end" sx={{ p: 1, textAlign: 'right', typography: 'body2' }}>
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

  const ticketCreateDialog = useBoolean();
  const reminderCreateDialog = useBoolean();

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
          <Box sx={{ color: 'text.secondary' }} className="print-hide">
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

      <Box
        sx={{
          flex: 1,
          mt: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <QuotationProductTable
          products={quotation?.productToQuotation}
          defaultRowsPerPage={quotation?.notes ? 5 : 10}
        />
        <Divider sx={{ mt: 1 }} />
      </Box>

      {renderTotal}

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

  const ticketsTab = (res) => {
    if (res.isPending || res.isLoading) {
      return <LoadingScreen />;
    }
    if (res.isError) {
      return <ErrorBlock />;
    }
    return (
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
            alignItems: 'center',
            m: 2,
          }}
        >
          <Box>
            <PermissionAccessController permission={PermissionsType.ADD_TICKET}>
              <Button
                onClick={() => ticketCreateDialog.onToggle()}
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Ticket
              </Button>
            </PermissionAccessController>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            flex: 1,
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <QuotationTicketsTable tickets={response.data.tickets} />
        </Box>
      </Stack>
    );
  };

  const remindersTab = (res) => {
    if (res.isPending || res.isLoading) {
      return <LoadingScreen />;
    }
    if (res.isError) {
      return <ErrorBlock />;
    }
    return (
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
            alignItems: 'center',
            m: 2,
          }}
        >
          <Box>
            <PermissionAccessController permission={PermissionsType.ADD_REMINDER}>
              <Button
                onClick={() => reminderCreateDialog.onToggle()}
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Reminder
              </Button>
            </PermissionAccessController>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            flex: 1,
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <QuotationRemindersTable reminders={response.data.reminders} />
        </Box>
      </Stack>
    );
  };

  const theme = useTheme();

  const router = useRouter();
  const handleViewOrder = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleEditQuotation = useCallback(
    (id) => {
      router.push(paths.dashboard.quotation.edit(id));
    },
    [router]
  );

  const contentToPrint = useRef();
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  return (
    <>
      <Card
        ref={contentToPrint}
        sx={{
          height: 1,
          display: 'flex',
          flexDirection: 'column',
          width: 1,
          transition: 'all 2s ease-in-out',
        }}
      >
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
        <Tabs
          className="print-hide"
          value={basicTabs.value}
          onChange={basicTabs.onChange}
          sx={{
            px: 3,
            // eslint-disable-next-line no-shadow
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} icon={tab.icon} value={tab.value} label={tab.label} />
          ))}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }}
          >
            <IconButton sx={{ ml: 1 }} onClick={handleResize}>
              <Iconify icon="solar:full-screen-bold" width={24} />
            </IconButton>
          </Box>
          <Box
            marginLeft="auto"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }}
          >
            <IconButton sx={{ ml: 1 }} onClick={handleClose}>
              <Iconify icon="solar:close-square-outline" width={24} />
            </IconButton>
          </Box>
        </Tabs>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            flex: 1,
          }}
        >
          <CardHeader
            sx={{ pt: 1 }}
            title={quotation?.name}
            subheader={`Quotation for Customer : ${quotation?.customer?.name}`}
            action={
              <Stack
                spacing={3}
                className="print-hide"
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-end', sm: 'center' }}
                sx={{ mb: { xs: 3, md: 5 } }}
              >
                <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
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
                  {renderDownload}

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
                  {/*
                        <Tooltip title="Send">
                          <IconButton>
                            <Iconify icon="iconamoon:send-fill" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Share">
                          <IconButton>
                            <Iconify icon="solar:share-bold" />
                          </IconButton>
                        </Tooltip> */}
                </Stack>
              </Stack>
            }
          />

          <Divider />
          {basicTabs.value === 'details' && detailsTab}
          {basicTabs.value === 'tickets' && ticketsTab(response)}
          {basicTabs.value === 'reminders' && remindersTab(response)}
        </Box>
      </Card>

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
    </>
  );
};
export default QuotationDetailCard;
