import { useState, useEffect, useCallback } from 'react';

import { Box, Table, TableRow, TableBody, TableCell } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { calculateAfterTax } from 'src/utils/helper';

import { applyFilter } from 'src/components/phone-input/utils';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

const CustomerOrdersTable = ({ orders, defaultRowsPerPage }) => {
  const TABLE_HEAD = [
    { id: 'ref', label: '#' },
    { id: 'price', label: 'Price', width: 220 },
  ];

  const table = useTable({ defaultOrderBy: 'orderId', defaultRowsPerPage });
  const [tableData, setTableData] = useState(orders);

  useEffect(() => {
    setTableData(orders);
  }, [orders]);

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
              ?.map((item, idx) => (
                <TableRow
                  key={item?.id}
                  onClick={() => handleViewProduct(item?.id)}
                  sx={{ cursor: 'pointer' }}
                  hover
                >
                  <TableCell>{item?.ref || idx || item?.id}</TableCell>
                  <TableCell>
                    {fCurrency(
                      calculateAfterTax(
                        item.totalOrderAmount - item.totalOrderAmount * (item.discount / 100),
                        item.snapshotTaxPercentage
                      )
                    ) || '-'}
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

export default CustomerOrdersTable;
