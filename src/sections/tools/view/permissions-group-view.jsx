import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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

import PermissionsGroupTableRow from '../permissions-group-table-row';
import { PermissionsGroupTableToolbar } from '../permissions-group-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'year', label: 'Name' },
  { id: 'startDate', label: 'Permissions Number', width: 240 },
  { id: 'endDate', label: 'Users Number', width: 240 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

function PermissionGroupView({ permissionsGroups }) {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const dialog = useBoolean();
  const dialogEdit = useBoolean();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(permissionsGroups);

  const filters = useSetState({
    name: '',
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  useEffect(() => {
    setTableData(permissionsGroups);
  }, [permissionsGroups]);

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
      deletePG(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const router = useRouter();

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.tools.editPermissions(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.tools.detailsPermissions(id));
    },
    [router]
  );

  const queryClient = useQueryClient();

  const { mutate: deletePG } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.permissionsGroup.delete + id),
    onSuccess: async (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
      await queryClient.invalidateQueries({ queryKey: ['permissions-groups'] });
    },
    onSettled: async () => {
      confirm.onFalse();
    },
    onError: () => {},
  });

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Tools', href: paths.dashboard.tools.root },
            { name: 'Permissions Groups' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.tools.newPermissions}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Permissions Group
            </Button>
          }
        />
        <Grid xs={12} md={12}>
          <Card>
            <PermissionsGroupTableToolbar
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
                        <PermissionsGroupTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
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
        </Grid>
      </Stack>
    </DashboardContent>
  );
}
export default PermissionGroupView;

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
      (order) => order.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
