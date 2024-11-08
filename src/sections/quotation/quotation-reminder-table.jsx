import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  InputAdornment,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { isDateTimeInPast } from 'src/utils/helper';
import { fDate, fIsAfter, fIsBetween } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import {
  useTable,
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

const TABLE_HEAD = [
  { id: '#', label: '#', width: 40 },
  { id: 'title', label: 'Title' },
  { id: 'rate', label: 'Date', width: 180 },
  { id: 'totalAmount', label: 'Status', width: 80 },
];

const QuotationRemindersTable = ({ reminders = [] }) => {
  const table = useTable({ defaultOrderBy: 'orderId', defaultRowsPerPage: 5 });
  const [tableData, setTableData] = useState(reminders);

  useEffect(() => {
    setTableData(reminders);
  }, [reminders]);

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

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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
          placeholder="Search reminder"
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
              .map((reminder, idx) => (
                <TableRow key={`${reminder.id}`}>
                  <TableCell align="center"> {idx + 1 || reminder.id} </TableCell>
                  <TableCell>{reminder.title}</TableCell>
                  <TableCell>{fDate(reminder.reminderDate)}</TableCell>
                  <TableCell>
                    <Label
                      variant="soft"
                      color={isDateTimeInPast(reminder.reminderDate) ? 'error' : 'success'}
                    >
                      <Iconify
                        icon={
                          isDateTimeInPast(reminder.reminderDate)
                            ? 'solar:forbidden-circle-bold'
                            : 'solar:check-circle-bold-duotone'
                        }
                        sx={{
                          color: isDateTimeInPast(reminder.reminderDate) ? 'error' : 'success',
                        }}
                      />
                    </Label>
                  </TableCell>
                </TableRow>
              ))}

            <TableEmptyRows
              emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
            />

            {/* {notFound && (
              <TableCell colSpan={12}>
                <EmptyContent sx={{ height: '40px' }} />
              </TableCell>
            )} */}
          </TableBody>
        </Table>
      </Box>

      <TablePaginationCustom
        sx={{ width: 1 }}
        page={table.page}
        dense
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Box>
  );
};
export default QuotationRemindersTable;

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
        order.title.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
