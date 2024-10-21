import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

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

import PaymentsTableRow from '../payments-table-row';
import PaymentEditDialog from '../payment-edit-dialog';
import PaymentDetailsDialog from '../payments-details-dialog';
import { PaymentsTableToolbar } from '../payments-table-toolbar';
import { PaymentsTableFiltersResult } from '../payments-table-filters-result';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'paymentId', label: '#', width: 88 },
  { id: 'date', label: 'Date', width: 220 },
  { id: 'customerName', label: 'Customer Name', width: 220 },
  { id: 'orderId', label: 'Order No', width: 120 },
  { id: 'paidAmount', label: 'Paid Amount', width: 120 },
  { id: 'paymentType', label: 'Payment Type', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

const PaymentsListView = ({ payments }) => {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const [selectedPayment, setSelectedPayment] = useState();

  const router = useRouter();

  const dialog = useBoolean();
  const dialogEdit = useBoolean();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(payments);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(payments);
  }, [payments]);

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
      deletePayment(id);
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const queryClient = useQueryClient();

  const handleDownloadClick = (file) => {
    downloadFile(file);
  };

  const { mutate: deletePayment } = useMutation({
    mutationFn: (id) => {
      axios.delete(endpoints.payments.delete + id);
    },
    onSuccess: () => {
      toast.success('Delete success!');
      confirm.onFalse();
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      confirm.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleViewRow = useCallback(
    (row) => {
      setSelectedPayment(row);
      dialog.onToggle();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  );

  const handleEditRow = useCallback(
    (row) => {
      setSelectedPayment(row);
      dialogEdit.onToggle();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const { mutate: handleEditPayment } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.payments.edit + id, payload),
    onSuccess: async () => {
      toast.success('New Payment Has Been Modified!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      dialogEdit.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
      <DashboardContent maxWidth="xl">
        <Stack spacing={3}>
          <CustomBreadcrumbs
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Payments', href: paths.dashboard.payments.root },
            ]}
          />
          <PermissionAccessController permission={PermissionsType.PAYMENT_LIST}>
            <Card>
              <PaymentsTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                dateError={dateError}
              />

              {canReset && (
                <PaymentsTableFiltersResult
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
                          <PaymentsTableRow
                            key={row.id}
                            index={table.page * table.rowsPerPage + index + 1}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onEditRow={() => handleEditRow(row)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onViewRow={() => handleViewRow(row)}
                            onViewFileRow={() => {
                              handleDownloadClick(row.attachments);
                            }}
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
          </PermissionAccessController>
        </Stack>
      </DashboardContent>
      <PaymentDetailsDialog
        payment={selectedPayment}
        open={dialog.value}
        onClose={dialog.onFalse}
      />
      <PaymentEditDialog
        payment={selectedPayment}
        open={dialogEdit.value}
        onClose={dialogEdit.onFalse}
        handler={handleEditPayment}
      />
    </>
  );
};
export default PaymentsListView;

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
        order.id.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
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
