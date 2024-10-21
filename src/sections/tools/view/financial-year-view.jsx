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

import { fIsAfter } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';
import { PermissionsType } from 'src/utils/constant';

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

import FinancialTableRow from '../financial-table-row';
import FinancialEditDialog from '../financial-edit-dialog';
import FinancialCreateDialog from '../financial-create-dialog';
import { FinancialTableToolbar } from '../financial-table-toolbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'year', label: 'Year', width: 140 },
  { id: 'startDate', label: 'Start Date' },
  { id: 'endDate', label: 'End Date' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

function FinancialYearView({ financialYears }) {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const dialog = useBoolean();
  const dialogEdit = useBoolean();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(financialYears);

  const filters = useSetState({
    name: '',
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  useEffect(() => {
    setTableData(financialYears);
  }, [financialYears]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      deleteFinancial(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const [selectedFinancial, setSelectedFinancial] = useState();

  const handleEditRow = useCallback(
    (row) => {
      setSelectedFinancial(row);
      dialogEdit.onToggle();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const queryClient = useQueryClient();

  const { mutate: deleteFinancial } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.financial.delete + id),
    onSuccess: async (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
      confirm.onFalse();
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['financial-year'] });
      confirm.onFalse();
    },
    onError: () => {},
  });

  const { mutate: handleCreateFinancial } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.financial.create, payload),
    onSuccess: async () => {
      toast.success('New Financial Year Has Been Created!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['financial-year'] });
      dialog.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: handleEditFinancial } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.financial.edit + id, payload),
    onSuccess: async () => {
      toast.success('Financial Year Has Been Modified!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['financial-year'] });
      dialogEdit.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return (
    <DashboardContent>
      <Stack spacing={3}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Tools', href: paths.dashboard.tools.root },
            { name: 'Financial Year' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
            <PermissionAccessController permission={PermissionsType.ADD_FINANCIAL_YEAR}>
              <Button
                onClick={() => dialog.onToggle()}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add Financial Year
              </Button>
            </PermissionAccessController>
          }
        />
        <PermissionAccessController permission={PermissionsType.FINANCIAL_LIST}>
          <Card>
            <FinancialTableToolbar
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
                        <FinancialTableRow
                          key={row.id}
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
      <FinancialCreateDialog
        open={dialog.value}
        onClose={dialog.onFalse}
        handler={handleCreateFinancial}
      />
      <FinancialEditDialog
        financial={selectedFinancial}
        open={dialogEdit.value}
        onClose={dialogEdit.onFalse}
        handler={handleEditFinancial}
      />
    </DashboardContent>
  );
}
export default FinancialYearView;

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) => order.year.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
