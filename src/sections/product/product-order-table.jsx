import { useState, useEffect, useCallback } from 'react';

import { Box, Table, TableRow, TableBody, TableCell } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { applyFilter } from 'src/components/phone-input/utils';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

const ProductOrderTable = ({ productOrders, defaultRowsPerPage }) => {
  const TABLE_HEAD = [
    { id: 'name', label: 'Order Ref', width: 150 },
    { id: 'customer', label: 'Customer' },
    { id: 'quantity', label: 'Quantity', width: 200 },
    { id: 'price', label: 'Price', width: 200 },
    { id: 'total', label: 'Total Order Amount', width: 200 },
  ];

  const table = useTable({ defaultOrderBy: 'orderId', defaultRowsPerPage });
  const [tableData, setTableData] = useState(productOrders);

  useEffect(() => {
    setTableData(productOrders);
  }, [productOrders]);

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

  const router = useRouter();
  const handleViewOrder = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
    >
      <Box sx={{ flex: 1, width: 1 }}>
        <Table size="medium">
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              ?.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>
                    <Box
                      onClick={() => handleViewOrder(item?.order?.id)}
                      sx={{
                        width: 240,
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        cursor: 'pointer',
                        marginRight: 5,
                      }}
                    >
                      <Iconify icon="heroicons-outline:external-link" />
                      <span>{item?.order?.ref}</span>
                    </Box>
                  </TableCell>
                  <TableCell> {item?.order?.customer.name} </TableCell>
                  <TableCell> x{item?.quantity} </TableCell>
                  <TableCell> {fCurrency(item?.snapshotProductPrice)} </TableCell>
                  <TableCell>{fCurrency(item?.order?.totalOrderAmount)} </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
      <TablePaginationCustom
        sx={{ width: 1 }}
        page={table.page}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Box>
  );
};
export default ProductOrderTable;
