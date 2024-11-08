import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Stack, Table, Avatar, TableBody, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useSetState } from 'src/hooks/use-set-state';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import ProductCategoryTableRow from '../product-table-category-row';

const TABLE_HEAD = [
  { id: 'productId', label: 'No.', width: 80 },
  { id: 'productName', label: 'Name' },
  { id: 'productPrice', label: 'Price', width: 200 },
  {
    id: 'stock',
    label: 'Stock',

    align: 'center',
  },
  { id: 'status', label: 'Status', width: 100 },
];

const ProductCategoryDetailsView = ({ category }) => {
  const table = useTable({ defaultOrderBy: 'planId' });

  const [tableData, setTableData] = useState(category.products);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(category.products);
  }, [category.products]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product', href: paths.dashboard.product.root },
          { name: 'Categories List', href: paths.dashboard.product.categories },
          { name: 'Category Details' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Stack spacing={2} direction={{ xs: 'column-reverse', md: 'column' }}>
            <Card>
              <CardHeader title="Details" />
              <Stack
                direction="row"
                gap={10}
                // justifyContent="space-between"
                sx={{
                  p: 3,
                  typography: 'body2',
                }}
              >
                <Box
                  flexDirection="column"
                  sx={{
                    p: 1,
                    display: 'flex',
                  }}
                >
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Avatar
                      sx={{ width: 100, height: 100 }}
                      alt={category?.name}
                      src={
                        CONFIG.site.serverFileHost +
                        (category?.image || CONFIG.site.defaultImgPlaceHolder)
                      }
                    />
                  </Stack>
                </Box>

                <Box
                  flexDirection="column"
                  gap={1}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    p: 1,
                  }}
                >
                  <Box sx={{ color: 'text.secondary' }}>Name: {category?.name}</Box>
                  <Box sx={{ color: 'text.secondary' }}>Description: {category?.description}</Box>
                </Box>
              </Stack>
            </Card>
            <Card>
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
        </Grid>
      </Grid>
    </DashboardContent>
  );
};
export default ProductCategoryDetailsView;

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
        product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
