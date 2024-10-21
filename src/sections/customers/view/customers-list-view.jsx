/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';
import { PermissionsType } from 'src/utils/constant';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

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

import CustomersTableRow from '../customers-table-row';
import CustomerEditDialog from '../customers-edit-dialog';
import CustomerCreateDialog from '../customers-create-dialog';
import { CustomersTableToolbar } from '../customers-table-toolbar';
import { CustomersTableFiltersResult } from '../customers-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customerId', label: '#', width: 88 },
  { id: 'name', label: 'Customer Name', width: 220 },
  { id: 'email', label: 'Email', width: 220 },
  {
    id: 'phoneNumber',
    label: 'Phone Number',
    width: 120,
  },
  { id: 'address', label: 'Address', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

const CustomersListView = ({ customers }) => {
  const table = useTable({ defaultOrderBy: 'id' });

  const dialog = useBoolean();
  const dialogEdit = useBoolean();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(customers);

  const [selectedCustomer, setSelectedCustomer] = useState();

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
    setTableData(customers);
  }, [customers]);

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      deleteCustomer(id);
    },
    [dataInPage.length, table, tableData]
  );

  const handleEditRow = useCallback(
    (row) => {
      setSelectedCustomer(row);
      dialogEdit.onToggle();
    },
    [dataInPage.length, table, tableData]
  );

  const queryClient = useQueryClient();

  const { mutate: handleCreateCustomer } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.customers.create, payload),
    onSuccess: async () => {
      toast.success('New Customer Has Been Created!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      dialog.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: handleEditCustomer } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.customers.edit + id, payload),
    onSuccess: async () => {
      toast.success('Customer Has Been Modified!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      dialogEdit.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteCustomer } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.customers.delete + id),
    onSuccess: async () => {
      // eslint-disable-next-line no-undef
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
      confirm.onFalse();
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      confirm.onFalse();
    },
    onError: () => {},
  });

  return (
    <>
      <DashboardContent maxWidth="xl">
        <Stack spacing={3}>
          <CustomBreadcrumbs
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Customers', href: paths.dashboard.customers.root },
            ]}
            action={
              <PermissionAccessController permission={PermissionsType.ADD_CUSTOMER}>
                <Button
                  onClick={() => dialog.onToggle()}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Add New Customer
                </Button>
              </PermissionAccessController>
            }
          />
          <PermissionAccessController permission={PermissionsType.LIST_CUSTOMER}>
            <Card>
              <CustomersTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                dateError={dateError}
              />

              {canReset && (
                <CustomersTableFiltersResult
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
                          <CustomersTableRow
                            key={row.id}
                            index={table.page * table.rowsPerPage + index + 1}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onEditRow={() => handleEditRow(row)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
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
      <CustomerCreateDialog
        open={dialog.value}
        onClose={dialog.onFalse}
        handler={handleCreateCustomer}
      />
      <CustomerEditDialog
        open={dialogEdit.value}
        onClose={dialogEdit.onFalse}
        handler={handleEditCustomer}
        customer={selectedCustomer}
      />
    </>
  );
};
export default CustomersListView;

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
        order.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.email.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.phoneNumber.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
