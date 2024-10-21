import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';

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

import { PlanTableRow } from '../plan-table-row';
import { PlanTableToolbar } from '../plan-table-toolbar';
import { PlanTableFiltersResult } from '../plan-table-filters-result';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'planId', label: 'Plan ID', width: 60 },
  { id: 'planDate', label: 'Plan Date', width: 140 },
  { id: 'product', label: 'Product', width: 140 },
  {
    id: 'quantity',
    label: 'Quantity',
    width: 120,
    align: 'center',
  },
  { id: 'status', label: 'Status', width: 140 },
  { id: 'createdBy', label: 'Created By', width: 140 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function PlanListView({ plans }) {
  const table = useTable({ defaultOrderBy: 'planId' });

  const router = useRouter();

  const [tableData, setTableData] = useState(plans);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(plans);
  }, [plans]);

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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.plan.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.plan.edit(id));
    },
    [router]
  );

  const queryClient = useQueryClient();

  const { mutate: deletePlan } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.plan.delete + id),
    onSuccess: async () => {
      // eslint-disable-next-line no-undef
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      await queryClient.invalidateQueries({ queryKey: ['plans-status'] });
    },
    onError: () => {},
  });

  const handleDeleteRow = useCallback(
    (id) => {
      deletePlan(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <CustomBreadcrumbs
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Plan', href: paths.dashboard.plan.root },
              { name: 'List' },
            ]}
            action={
              <PermissionAccessController permission={PermissionsType.ADD_PLAN}>
                <Button
                  component={RouterLink}
                  href={paths.dashboard.plan.new}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  Add New Plan
                </Button>
              </PermissionAccessController>
            }
          />
        </Grid>
        <PermissionAccessController permission={PermissionsType.LIST_PLAN}>
          <Grid xs={12} md={12}>
            <Card>
              <PlanTableToolbar
                filters={filters}
                onResetPage={table.onResetPage}
                dateError={dateError}
              />

              {canReset && (
                <PlanTableFiltersResult
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
                          <PlanTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
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
        order.product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.createdBy.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.createdBy.lastName.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
