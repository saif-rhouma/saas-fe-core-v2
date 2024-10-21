import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useSetState } from 'src/hooks/use-set-state';

import { fCurrency } from 'src/utils/format-number';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

import ReportsDailyTableRow from '../reports-daily-table-row';
import { ReportsDailyTableToolbar } from '../reports-daily-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'reminderId', label: 'Particular' },
  { id: 'date', label: 'value', width: 280 },
];

const TABLE_ROWS = [
  { label: 'Orders', value: 0 },
  { label: 'No. of Orders Delivered', value: 0 },
  { label: 'Total Sales', value: 0 },
  { label: 'Total Payment', value: 0 },
];

// ----------------------------------------------------------------------

const ReportsDailyListView = ({ orders }) => {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const [tableData, setTableData] = useState(orders);
  // const [dailyData, setDailyData] = useState(TABLE_ROWS);
  const dailyData = useRef(TABLE_ROWS);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const getDataRow = useCallback((data) => {
    const nbDelivered = data.filter((row) => row.status === 'Delivered').length;

    const totalSales = fCurrency(data.reduce((acc, order) => acc + order.totalOrderAmount, 0));
    const totalPayments = fCurrency(data.reduce((acc, order) => acc + order.orderPaymentAmount, 0));
    const result = {
      orders: data.length,
      nbDelivered,
      totalSales,
      totalPayments,
    };
    return result;
  }, []);

  const dailyResult = (data) => {
    const rowValues = getDataRow(data);
    const tableRowValues = [
      { label: 'Orders', value: rowValues.orders },
      { label: 'No. of Orders Delivered', value: rowValues.nbDelivered },
      { label: 'Total Sales', value: rowValues.totalSales },
      { label: 'Total Payment', value: rowValues.totalPayments },
    ];
    return tableRowValues;
  };

  useEffect(() => {
    if (orders) {
      setTableData(orders);
    }
  }, [orders]);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            { name: 'Daily Report', href: paths.dashboard.reports.daily },
          ]}
        />
        <Card>
          <ReportsDailyTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
            />

            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
              />

              <TableBody>
                {dailyResult(dataFiltered).map((row) => (
                  <ReportsDailyTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                  />
                ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Box>
        </Card>
      </Stack>
    </DashboardContent>
  );
};
export default ReportsDailyListView;

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.orderDate, startDate, endDate));
    }
  }

  return inputData;
}
