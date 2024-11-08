/* eslint-disable react/no-unknown-property */
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useSetState } from 'src/hooks/use-set-state';

import { exportToExcel } from 'src/utils/helper';
import { fCurrency } from 'src/utils/format-number';
import { PermissionsType } from 'src/utils/constant';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import ReportsOrderTableRow from '../reports-order-table-row';
import { ReportsOrderTableToolbar } from '../reports-order-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', width: 140 },
  { id: 'orderId', label: 'Order Id' },
  { id: 'customer', label: 'Customer' },
  { id: 'orderAmount', label: 'Order Amount' },
  { id: 'status', label: 'Status' },
];

// ----------------------------------------------------------------------

const ReportsOrderListView = ({ orders }) => {
  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const contentToPrint = useRef();
  const [tableData, setTableData] = useState(orders);

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

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            { name: 'Order Report', href: paths.dashboard.reports.order },
          ]}
        />
        <Card ref={contentToPrint} className="print-padding">
          <Stack justifyContent="center" alignItems="center">
            <h1 className="print-title">Order Reports</h1>
          </Stack>
          {/* Add some CSS to hide the title on screen and show it only in print */}
          <style jsx>{`
            .print-title {
              display: none; /* Hide on screen */
            }

            @media print {
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
          <ReportsOrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              className="print-hide"
            />

            <Table size={table.dense ? 'small' : 'medium'}>
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
                    <ReportsOrderTableRow
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
          <TablePaginationCustom
            className="print-hide"
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                p: 3,
                typography: 'body2',
              }}
            >
              <Stack spacing={1}>
                <Box sx={{ color: 'text.secondary' }}>Total Orders: {dataFiltered.length}</Box>
                <Box sx={{ color: 'text.secondary' }}>
                  Total Order Amount:{' '}
                  {fCurrency(dataFiltered.reduce((acc, order) => acc + order.totalOrderAmount, 0))}
                </Box>
              </Stack>
              <Box>
                <Stack direction="row" spacing={1} className="print-hide">
                  <PermissionAccessController permission={PermissionsType.DOWNLOAD_REPORT}>
                    <Button
                      onClick={() => {
                        const headers = [
                          { displayName: 'Date', key: 'orderDate' },
                          { displayName: 'Order Ref', key: 'ref' },
                          { displayName: 'Customer', key: 'name' },
                          { displayName: 'Order Amount', key: 'totalOrderAmount' },
                          { displayName: 'Status', key: 'status' },
                        ];
                        exportToExcel(
                          'plan reports',
                          headers,
                          dataFiltered.map((el) => ({ ...el, name: el?.customer?.name })),
                          'Stock'
                        );
                      }}
                      variant="contained"
                      startIcon={<Iconify icon="mdi:microsoft-excel" />}
                    >
                      Download Report
                    </Button>
                  </PermissionAccessController>
                  <PermissionAccessController permission={PermissionsType.PRINT_REPORT}>
                    <Button
                      variant="outlined"
                      onClick={() => handlePrint()}
                      startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
                    >
                      Print Report
                    </Button>
                  </PermissionAccessController>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Card>
      </Stack>
    </DashboardContent>
  );
};
export default ReportsOrderListView;

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
        order.orderNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

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
