import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

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

import ProductCategoryTableRow from '../product-category-table-row';
import ProductCategoryEditDialog from '../product-category-edit-dialog';
import ProductCategoryCreateDialog from '../product-category-create-dialog';
import { ProductCategoryTableToolbar } from '../product-category-table-toolbar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'No.', width: 80 },
  { id: 'name', label: 'Category Name', width: 300 },
  { id: 'desc', label: 'Description' },
  { id: 'status', label: 'Product Count', width: 200 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

const ProductCategoryView = ({ categories }) => {
  const confirm = useBoolean();

  const dialogCreate = useBoolean();
  const dialogEdit = useBoolean();

  const [selectedCategory, setSelectedCategory] = useState();

  const table = useTable({ defaultOrderBy: 'planId' });
  const [tableData, setTableData] = useState(categories);
  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(categories);
  }, [categories]);

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

  const queryClient = useQueryClient();

  const { mutate: deleteCategory } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.productCategories.delete + id),
    onSuccess: async (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
      await queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleDeleteRow = useCallback(
    (id) => {
      deleteCategory(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const handleEditRow = useCallback(
    (row) => {
      setSelectedCategory(row);
      dialogEdit.onToggle();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const { mutate: handleCreateCategory } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.productCategories.create, payload),
    onSuccess: async () => {
      toast.success('New Category Has Been Created!');
      await queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
    onSettled: async () => {
      dialogCreate.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: handleEditCategory } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.productCategories.edit + id, payload),
    onSuccess: async () => {
      toast.success('Category Has Been Modified!');
      await queryClient.invalidateQueries({ queryKey: ['product-categories'] });
    },
    onSettled: async () => {
      dialogEdit.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const router = useRouter();

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.categoryDetails(id));
    },
    [router]
  );

  return (
    <>
      <DashboardContent maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <CustomBreadcrumbs
              links={[
                { name: 'Dashboard', href: paths.dashboard.root },
                { name: 'Product', href: paths.dashboard.plan.root },
                { name: 'Categories List' },
              ]}
              action={
                <PermissionAccessController permission={PermissionsType.ADD_CATEGORY}>
                  <Button
                    onClick={() => dialogCreate.onToggle()}
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                  >
                    Add New Category
                  </Button>
                </PermissionAccessController>
              }
            />
          </Grid>
          <Grid xs={12} md={12}>
            <PermissionAccessController permission={PermissionsType.CATEGORY_LIST}>
              <Card>
                <ProductCategoryTableToolbar
                  filters={filters}
                  onResetPage={table.onResetPage}
                  dateError={dateError}
                />

                <Box sx={{ position: 'relative' }}>
                  <TableSelectedAction
                    dense={table.dense}
                    numSelected={table.selected.length}
                    rowCount={dataFiltered.length}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => row.id)
                      )
                    }
                    action={
                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={confirm.onTrue}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <Scrollbar sx={{ minHeight: 444 }}>
                    <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                      <TableHeadCustom
                        order={table.order}
                        orderBy={table.orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={dataFiltered.length}
                        numSelected={table.selected.length}
                        onSort={table.onSort}
                      />

                      <TableBody>
                        {dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage
                          )
                          .map((row, index) => (
                            <ProductCategoryTableRow
                              key={row.id}
                              row={row}
                              index={table.page * table.rowsPerPage + index + 1}
                              selected={table.selected.includes(row.id)}
                              onEditRow={() => handleEditRow(row)}
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
            </PermissionAccessController>
          </Grid>
        </Grid>
      </DashboardContent>
      <ProductCategoryCreateDialog
        handler={handleCreateCategory}
        open={dialogCreate.value}
        onClose={dialogCreate.onFalse}
      />
      <ProductCategoryEditDialog
        handler={handleEditCategory}
        open={dialogEdit.value}
        onClose={dialogEdit.onFalse}
        category={selectedCategory}
      />
    </>
  );
};
export default ProductCategoryView;

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
      (product) =>
        product.id.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        product.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
