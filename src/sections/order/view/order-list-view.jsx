/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';
import { PermissionsType } from 'src/utils/constant';
import { fIsAfter, monthName, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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

import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';
import { OrderTableFiltersResult } from '../order-table-filters-result';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'orderNumber', label: '#', width: 88 },
  { id: 'name', label: 'Customer' },
  { id: 'createdAt', label: 'Date', width: 140 },
  {
    id: 'totalQuantity',
    label: 'Items',
    width: 120,
    align: 'center',
  },
  { id: 'totalAmount', label: 'Price', width: 140 },
  { id: 'createdBy', label: 'Created By', width: 200 },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function OrderListView({ orders, analytics }) {
  const table = useTable({ defaultOrderBy: 'orderId' });

  const router = useRouter();

  const theme = useTheme();

  const [tableData, setTableData] = useState(() => orders);
  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(orders);
  }, [orders]);

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

  const queryClient = useQueryClient();

  const { mutate: deleteOrder } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.order.delete + id),
    onSuccess: async () => {
      // const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Order Has Been Canceled!');

      // setTableData(deleteRow);

      // table.onUpdatePageDeleteRow(dataInPage.length);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orders-status'] });
      await queryClient.invalidateQueries({ queryKey: ['orders', 'analytics'] });
    },
    onError: () => {},
  });

  const handleDeleteRow = useCallback(
    (id) => {
      deleteOrder(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.replace(paths.dashboard.order.details(id));
    },
    [router]
  );

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <CustomBreadcrumbs
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Order', href: paths.dashboard.order.root },
              { name: 'List' },
            ]}
            action={
              <PermissionAccessController permission={PermissionsType.ADD_ORDER}>
                <Button
                  component={RouterLink}
                  href={paths.dashboard.order.new}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  New Order
                </Button>
              </PermissionAccessController>
            }
          />
        </Grid>
        <PermissionAccessController permission={PermissionsType.LIST_ORDER}>
          <Grid xs={12} md={3}>
            <AppWidgetSummary
              title="All Orders"
              total={orders.length}
              chart={{
                categories: analytics.data.lastSixMonth.map((item) => monthName(item?.inMonth)),
                series: analytics.data.lastSixMonth.map((item) => item?.ClaimsPerMonth),
              }}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <AppWidgetSummary
              title="Processing Order"
              total={analytics.data.analytics.InProcess}
              chart={{
                colors: [theme.vars.palette.warning.light],
                categories: analytics.data.inProcessLastSixMonth.map((item) =>
                  monthName(item?.inMonth)
                ),
                series: analytics.data.inProcessLastSixMonth.map((item) => item?.ClaimsPerMonth),
              }}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <AppWidgetSummary
              title="Ready To Deliver"
              total={analytics.data.analytics.Ready}
              chart={{
                colors: [theme.vars.palette.info.main],
                categories: analytics.data.readyLastSixMonth.map((item) =>
                  monthName(item?.inMonth)
                ),
                series: analytics.data.readyLastSixMonth.map((item) => item?.ClaimsPerMonth),
              }}
            />
          </Grid>

          <Grid xs={12} md={3}>
            <AppWidgetSummary
              title="Delivered"
              total={analytics.data.analytics.Delivered}
              chart={{
                colors: [theme.vars.palette.success.main],
                categories: analytics.data.deliveredLastSixMonth.map((item) =>
                  monthName(item?.inMonth)
                ),
                series: analytics.data.deliveredLastSixMonth.map((item) => item?.ClaimsPerMonth),
              }}
            />
          </Grid>
          <Grid xs={12} md={12}>
            <Card>
              <OrderTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                dateError={dateError}
              />

              {canReset && (
                <OrderTableFiltersResult
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
                        .map((row) => (
                          <OrderTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
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
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.id.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.status.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createTime, startDate, endDate));
    }
  }

  return inputData;
}
