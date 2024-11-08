import { useState, useEffect, useCallback } from 'react';

import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import {
  Box,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  InputAdornment,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { fCurrency } from 'src/utils/format-number';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

const TABLE_HEAD = [
  { id: 'orderNumber', label: '#', width: 40, align: 'center' },
  { id: 'name', label: 'Product Name' },
  { id: 'rate', label: 'Rate', width: 200 },
  { id: 'totalAmount', label: 'Quantity', width: 80 },
  { id: 'status', label: 'Total', width: 200 },
];

const QuotationProductTable = ({ products, defaultRowsPerPage }) => {
  const table = useTable({ defaultOrderBy: 'orderId', defaultRowsPerPage });
  const [tableData, setTableData] = useState(products);

  useEffect(() => {
    setTableData(products);
  }, [products]);

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

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const handleFilterName = useCallback(
    (event) => {
      table.onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, table]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        borderRadius: 1,
        height: 1,
        width: 1,
        overflow: 'hidden',
        border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
    >
      <Stack
        className="print-hide"
        spacing={2}
        justifyContent={{ xs: 'space-between' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 1, width: 1 }}
      >
        <TextField
          value={filters.state.name}
          onChange={handleFilterName}
          size="small"
          placeholder="Search product"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Box sx={{ flex: 1, width: 1 }}>
        <Table size="small">
          <TableHeadCustom headLabel={TABLE_HEAD} />
          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((product, idx) => (
                <TableRow key={`${product.productId}`}>
                  <TableCell align="center"> {idx + 1 || product.productId} </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AvatarGroup
                        sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 24, height: 24 } }}
                      >
                        <Avatar
                          key={product?.id}
                          alt={product?.name}
                          src={`${CONFIG.site.serverFileHost}${product?.image}`}
                        />
                      </AvatarGroup>
                      {`${product.product.name}`}
                    </Stack>
                  </TableCell>
                  <TableCell align="inherit">
                    {`${fCurrency(product.snapshotProductPrice || product.product.price)}`}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: 240, color: 'error.main', fontWeight: 'bold' }}>
                      x{product?.quantity}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {`${fCurrency(product.snapshotProductPrice * product.quantity)}`}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
      <TablePaginationCustom
        className="print-hide"
        sx={{ width: 1 }}
        page={table.page}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        rowsPerPageOptions={[]}
      />
    </Box>
  );
};
export default QuotationProductTable;

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
        product?.product?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
