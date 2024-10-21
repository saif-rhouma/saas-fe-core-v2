import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useSetState } from 'src/hooks/use-set-state';

import { exportToExcel } from 'src/utils/helper';
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

import ReportsStockTableRow from '../reports-stock-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: '#', width: 60 },
  { id: 'productName', label: 'Product Name', width: 260 },
  { id: 'planId', label: 'Plan Qty' },
  { id: 'orderAmount', label: 'Pending Stock' },
  { id: 'status', label: 'Processing A Stock' },
  { id: 'status', label: 'Processing B Stock' },
  { id: 'status', label: 'Ready to Deliver Stock' },
  // { id: 'status', label: 'Delivered Stock' },
  { id: 'status', label: 'In Stock' },
];

// ----------------------------------------------------------------------

const ReportsStockListView = ({ products }) => {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const [tableData, setTableData] = useState(products);

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

  useEffect(() => {
    setTableData(products);
  }, [products]);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const headers = [
    { displayName: 'Product Name', key: 'name' },
    { displayName: 'Plan Qty', key: 'totals_quantity' },
    { displayName: 'Pending Stock', key: 'pending_quantity' },
    { displayName: 'Processing A Stock', key: 'processing_a_quantity' },
    { displayName: 'Processing B Stock', key: 'processing_b_quantity' },
    { displayName: 'Ready to Deliver Stock', key: 'ready_quantity' },
    { displayName: 'In Stock', key: 'in_stock' },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            { name: 'Stock Report', href: paths.dashboard.reports.stock },
          ]}
          action={
            <PermissionAccessController permission={PermissionsType.DOWNLOAD_REPORT}>
              <Button
                onClick={() => {
                  exportToExcel('stock reports', headers, dataFiltered, 'Stock');
                }}
                variant="contained"
                startIcon={<Iconify icon="mdi:microsoft-excel" />}
              >
                Export Excel
              </Button>
            </PermissionAccessController>
          }
        />
        <Card>
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
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ReportsStockTableRow
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
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </Stack>
    </DashboardContent>
  );
};
export default ReportsStockListView;

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
      inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
