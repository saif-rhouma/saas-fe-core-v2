import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

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

import StaffTableRow from '../staff-table-row';
import { StaffTableToolbar } from '../staff-table-toolbar';
import { StaffTableFiltersResult } from '../staff-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'reminderId', label: '#', width: 140 },
  { id: 'staffName', label: 'Staff Name', width: 280 },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'emailAddress', label: 'Email Address' },
  { id: 'status', label: 'Status' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

const StaffListView = ({ staffs }) => {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const router = useRouter();

  const [tableData, setTableData] = useState(staffs);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(staffs);
  }, [staffs]);

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
      deleteStaff(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const queryClient = useQueryClient();
  const { mutate: handleChangeStatusStaff } = useMutation({
    mutationFn: async ({ id, payload }) => {
      await axios.patch(endpoints.staff.edit + id, payload);
      return id;
    },
    onSuccess: async (id) => {
      toast.success('Staff Has Been Modified!');
      await queryClient.invalidateQueries({ queryKey: ['staff', id] });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['staffs'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: deleteStaff } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.staff.delete + id),
    onSuccess: async (id) => {
      // eslint-disable-next-line no-undef
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['staffs'] });
    },
    onError: () => {},
  });

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.staff.edit(id));
    },
    [router]
  );
  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.staff.root },
          ]}
          action={
            <PermissionAccessController permission={PermissionsType.ADD_STAFF}>
              <Button
                component={RouterLink}
                href={paths.dashboard.staff.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add New User
              </Button>
            </PermissionAccessController>
          }
        />
        <PermissionAccessController permission={PermissionsType.STAFF_LIST}>
          <Card>
            <StaffTableToolbar
              filters={filters}
              onResetPage={table.onResetPage}
              dateError={dateError}
            />

            {canReset && (
              <StaffTableFiltersResult
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
                        <StaffTableRow
                          key={row.id}
                          row={row}
                          index={table.page * table.rowsPerPage + index + 1}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          handler={handleChangeStatusStaff}
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
  );
};
export default StaffListView;

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
        // order.staffName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.staffName.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
