/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
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

import { ErrorBlock } from 'src/sections/error/error-block';

import ProductStockTableRow from '../product-stock-table-row';
import ProductStockEditDialog from '../product-stock-edit-dialog';
import ProductStockCreateDialog from '../product-stock-create-dialog';
import { ProductStockTableToolbar } from '../product-stock-table-toolbar';
import { ProductTableFiltersResult } from '../product-table-filters-result';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'stockId', label: 'No.', width: 60 },
  { id: 'productName', label: 'Product Name' },
  { id: 'stock', label: 'In Stock', width: 200 },
  // { id: '', width: 40 },
];

// ----------------------------------------------------------------------

export function ProductStockView({ stocks }) {
  const table = useTable({ defaultOrderBy: 'planId' });

  const [selectedStock, setSelectedStock] = useState();

  const dialog = useBoolean();
  const dialogEdit = useBoolean();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(stocks);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(stocks);
  }, [stocks]);

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const handleEditRow = useCallback(
    (row) => {
      setSelectedStock(row);
      dialogEdit.onToggle();
    },
    [dataInPage.length, table, tableData]
  );

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const productsList = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(endpoints.products.list);
      return data;
    },
  });

  if (productsList.isPending || productsList.isLoading) {
    return <LoadingScreen />;
  }
  if (productsList.isError) {
    return <ErrorBlock route={paths.dashboard.products.root} />;
  }

  return (
    <>
      <DashboardContent maxWidth="xl">
        <Stack spacing={3}>
          <CustomBreadcrumbs
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Products', href: paths.dashboard.product.root },
              { name: 'Product Stock' },
            ]}
            // action={
            //   productsList.data.filter((prod) => prod.stock === null).length ? (
            //     <Button
            //       onClick={() => dialog.onToggle()}
            //       variant="contained"
            //       startIcon={<Iconify icon="mingcute:add-line" />}
            //     >
            //       Add Stock
            //     </Button>
            //   ) : (
            //     ''
            //   )
            // }
          />
          <Card>
            <ProductStockTableToolbar
              filters={filters}
              onResetPage={table.onResetPage}
              dateError={dateError}
            />

            {canReset && (
              <ProductTableFiltersResult
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
              <Scrollbar sx={{ minHeight: 200 }}>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                  />
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <ProductStockTableRow
                        key={row.id}
                        index={table.page * table.rowsPerPage + index + 1}
                        row={row}
                        onEditRow={() => handleEditRow(row)}
                        selected={table.selected.includes(row.id)}
                      />
                    ))}
                  <TableBody>
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
        </Stack>
      </DashboardContent>
      {dialog.value && (
        <ProductStockCreateDialog
          productsList={productsList.data}
          open={dialog.value}
          onClose={dialog.onFalse}
        />
      )}

      <ProductStockEditDialog
        stock={selectedStock}
        open={dialogEdit.value}
        onClose={dialogEdit.onFalse}
      />
    </>
  );
}

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
      (order) =>
        order.id.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
