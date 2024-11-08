import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
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

import ReportsPlanTableRow from '../reports-plan-table-row';
import { ReportsPlanTableToolbar } from '../reports-plan-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', width: 300 },
  { id: 'planId', label: 'Plan Id' },
  { id: 'productName', label: 'Product Name' },
  { id: 'orderAmount', label: 'Product QTY' },
  { id: 'status', label: 'Status' },
];

// ----------------------------------------------------------------------

const ReportsPlanListView = ({ plans }) => {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const [tableData, setTableData] = useState(plans);

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

  const headers = [
    { displayName: 'Date', key: 'planDate' },
    { displayName: 'Plan Ref', key: 'ref' },
    { displayName: 'Product Name', key: 'name' },
    { displayName: 'Product QTY', key: 'quantity' },
    { displayName: 'Status', key: 'status' },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Reports', href: paths.dashboard.reports.root },
            { name: 'Plan Report', href: paths.dashboard.reports.plan },
          ]}
        />
        <Card>
          <ReportsPlanTableToolbar
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
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ReportsPlanTableRow
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
              justifyContent="flex-end"
              sx={{
                p: 3,
                typography: 'body2',
              }}
            >
              <Box>
                <Stack direction="row" spacing={1}>
                  <PermissionAccessController permission={PermissionsType.DOWNLOAD_REPORT}>
                    <Button
                      onClick={() => {
                        exportToExcel(
                          'plan reports',
                          headers,
                          dataFiltered.map((el) => ({ ...el, name: el?.product?.name })),
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
                      // onClick={() => handlePrint()}
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
export default ReportsPlanListView;

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
      inputData = inputData.filter((order) => fIsBetween(order.planDate, startDate, endDate));
    }
  }

  return inputData;
}
