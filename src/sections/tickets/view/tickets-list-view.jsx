/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';
import { PermissionsType } from 'src/utils/constant';
import { downloadFile } from 'src/utils/download-file';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { AppWidgetSummary } from 'src/sections/overview/app/app-widget-summary';

import TicketsTableRow from '../tickets-table-row';
import TicketsCreateDialog from '../tickets-create-dialog';
import { TicketsTableToolbar } from '../tickets-table-toolbar';
import { TicketsTableFiltersResult } from '../tickets-table-filters-result';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ticketId', label: '#', width: 140 },
  { id: 'date', label: 'Date', width: 280 },
  { id: 'topic', label: 'Topic' },
  { id: 'priority', label: 'Priority' },
  { id: 'lastUpdate', label: 'Last Updated' },
  { id: 'status', label: 'Status' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

const TicketsListView = ({ tickets, analytics }) => {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const router = useRouter();

  const dialogCreate = useBoolean();

  const [tableData, setTableData] = useState(tickets);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(tickets);
  }, [tickets]);

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      deleteTicket(id);
    },
    [dataInPage.length, table, tableData]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.tickets.details(id));
    },
    [router]
  );

  const queryClient = useQueryClient();

  const handleDownloadClick = (file) => {
    downloadFile(file);
  };

  const { mutate: deleteTicket } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.tickets.delete + id),
    onSuccess: async () => {
      toast.success('Delete success!');
      await queryClient.invalidateQueries({ queryKey: ['tickets'] });
      await queryClient.invalidateQueries({ queryKey: ['tickets', 'analytics'] });
    },
    onSettled: async () => {},
    onError: (err) => {},
  });

  const getAnalytics = () => {
    if (analytics.isPending || analytics.isLoading) {
      return (
        <Grid xs={12} md={12}>
          <LoadingScreen />
        </Grid>
      );
    }
    return (
      <>
        <Grid xs={12} md={4}>
          <AppWidgetSummary title="All Tickets" total={tickets.length} chart={{}} />
        </Grid>
        <Grid xs={12} md={4}>
          <AppWidgetSummary title="Open Tickets" total={analytics.data.analytics.Open} chart={{}} />
        </Grid>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Close Tickets"
            total={analytics.data.analytics.Closed}
            chart={{}}
          />
        </Grid>
      </>
    );
  };

  return (
    <>
      <DashboardContent maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <CustomBreadcrumbs
              links={[
                { name: 'Dashboard', href: paths.dashboard.root },
                { name: 'Ticket', href: paths.dashboard.tickets.root },
              ]}
              action={
                <PermissionAccessController permission={PermissionsType.ADD_TICKET}>
                  <Button
                    onClick={() => dialogCreate.onToggle()}
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                  >
                    Add New Ticket
                  </Button>
                </PermissionAccessController>
              }
            />
          </Grid>
          <PermissionAccessController permission={PermissionsType.TICKET_LIST}>
            {getAnalytics()}
            <Grid xs={12} md={12}>
              <Card>
                <TicketsTableToolbar
                  filters={filters}
                  onResetPage={table.onResetPage}
                  dateError={dateError}
                />

                {canReset && (
                  <TicketsTableFiltersResult
                    filters={filters}
                    totalResults={dataFiltered.length}
                    onResetPage={table.onResetPage}
                    sx={{ p: 2.5, pt: 0 }}
                  />
                )}

                <Box sx={{ position: 'relative' }}>
                  <TableSelectedAction
                    dense={table.dense}
                    numSelected={table.selected.length}
                    rowCount={dataFiltered.length}
                  />

                  <Scrollbar sx={{ minHeight: 444 }}>
                    <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                      <TableHeadCustom
                        order={table.order}
                        orderBy={table.orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={dataFiltered.length}
                      />

                      <TableBody>
                        {dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage
                          )
                          .map((row, index) => (
                            <TicketsTableRow
                              key={row.id}
                              row={row}
                              index={table.page * table.rowsPerPage + index + 1}
                              selected={table.selected.includes(row.id)}
                              onSelectRow={() => table.onSelectRow(row.id)}
                              onDeleteRow={() => handleDeleteRow(row.id)}
                              onViewRow={() => handleViewRow(row.id)}
                              onViewFileRow={() => handleDownloadClick(row.file)}
                            />
                          ))}

                        <TableEmptyRows
                          height={table.dense ? 56 : 56 + 20}
                          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                        />

                        <TableNoData notFound={notFound} />
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Box>

                <TablePaginationCustom
                  page={table.page}
                  dense={table.dense}
                  count={dataFiltered.length}
                  rowsPerPage={table.rowsPerPage}
                  onPageChange={table.onChangePage}
                  onChangeDense={table.onChangeDense}
                  onRowsPerPageChange={table.onChangeRowsPerPage}
                />
              </Card>
            </Grid>
          </PermissionAccessController>
        </Grid>
      </DashboardContent>
      {/* <TicketsDetailsDialog open={() => true} ticket={dataFiltered[0]} /> */}
      <TicketsCreateDialog open={dialogCreate.value} onClose={dialogCreate.onFalse} />
    </>
  );
};
export default TicketsListView;

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.id.toString().indexOf(name.toLowerCase()) !== -1 ||
        order.topic.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.priority.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
