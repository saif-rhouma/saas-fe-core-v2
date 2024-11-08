import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Table,
  Stack,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TextField,
  InputAdornment,
} from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { fDate, fIsAfter, fIsBetween } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import {
  useTable,
  rowInPage,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

const TABLE_HEAD = [
  { id: 'orderNumber', label: '#', width: 40, align: 'center' },
  { id: 'name', label: 'Topic', width: 400 },
  { id: 'rate', label: 'Date', width: 200 },
  { id: 'totalAmount', label: 'Status' },
  { id: 'status', label: 'Priority' },
];

const QuotationTicketsTable = ({ tickets }) => {
  const table = useTable({ defaultOrderBy: 'orderId', defaultRowsPerPage: 5 });
  const [tableData, setTableData] = useState(tickets);
  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setTableData(tickets);
  }, [tickets]);

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

  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleFilterName = useCallback(
    (event) => {
      table.onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, table]
  );

  const handleFilterStatus = useCallback(
    (newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue.target.value });
      setSelectedStatus(newValue.target.value);
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
          placeholder="Search ticket"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Select
          size="small"
          sx={{ width: 200, textTransform: 'capitalize' }}
          value={selectedStatus}
          onChange={handleFilterStatus}
        >
          <MenuItem value="all">All Tickets</MenuItem>
          <MenuItem value="Open">Open Tickets</MenuItem>
          <MenuItem value="Closed">Close Tickets</MenuItem>
        </Select>
      </Stack>
      <Box sx={{ flex: 1, width: 1 }}>
        <Table size="medium">
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((ticket, idx) => (
                <TableRow key={`${ticket.id}`}>
                  <TableCell align="center"> {idx + 1 || ticket.id} </TableCell>
                  <TableCell>{ticket.topic}</TableCell>
                  <TableCell>{fDate(ticket.createTime)}</TableCell>
                  <TableCell>
                    <Label
                      variant="soft"
                      color={
                        (ticket.status === 'Open' && 'info') ||
                        (ticket.status === 'Closed' && 'default') ||
                        'default'
                      }
                    >
                      {ticket.status}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Label
                      variant="soft"
                      color={
                        (ticket.priority === 'Low' && 'success') ||
                        (ticket.priority === 'Medium' && 'warning') ||
                        (ticket.priority === 'Hight' && 'error') ||
                        'default'
                      }
                    >
                      {ticket.priority}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
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
export default QuotationTicketsTable;

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
        order.topic.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
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
