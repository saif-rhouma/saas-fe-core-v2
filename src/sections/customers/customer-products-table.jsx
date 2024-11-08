import { useState, useEffect, useCallback } from 'react';

import { Box, Table, Stack, Avatar, TableRow, TableBody, TableCell } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { applyFilter } from 'src/components/phone-input/utils';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

const CustomerProductsTable = ({ products, defaultRowsPerPage }) => {
  const TABLE_HEAD = [
    { id: 'id', width: 60, label: '#' },
    { id: 'name', label: 'Product' },
    { id: 'quantity', label: 'Quantity', width: 120 },
  ];

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

  const router = useRouter();

  const handleViewProduct = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
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
              ?.map((item, idx) => (
                <TableRow key={item?.id}>
                  <TableCell> {idx + 1} </TableCell>
                  <TableCell>
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Avatar
                        alt={item?.name}
                        src={
                          CONFIG.site.serverFileHost +
                          (item?.image || CONFIG.site.defaultImgPlaceHolder)
                        }
                      />
                      <Box
                        component="span"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          handleViewProduct(item.id);
                        }}
                      >
                        {item?.name}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: 240, color: 'error.main', fontWeight: 'bold' }}>
                      x{item?.total_quantity}
                    </Box>
                  </TableCell>
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
export default CustomerProductsTable;
