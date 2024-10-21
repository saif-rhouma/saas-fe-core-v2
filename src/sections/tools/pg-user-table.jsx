import { useState, useEffect } from 'react';

import { Box, Table, Button, TableRow, TableBody, TableCell } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { PermissionsGroupTableToolbar } from './permissions-group-table-toolbar';

const TABLE_HEAD = [
  { id: 'idx', label: '#', width: 40, align: 'center' },
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'action', width: 10 },
];

const PGUserTable = ({ users, onDeleteRow }) => {
  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const confirm = useBoolean();

  const [selectedUser, setSelectedUser] = useState();

  const [tableData, setTableData] = useState(users);

  const filters = useSetState({
    name: '',
  });

  useEffect(() => {
    setTableData(users);
  }, [users]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 1,
          overflow: 'hidden',
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <PermissionsGroupTableToolbar filters={filters} onResetPage={table.onResetPage} />
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((user, idx) => (
                <TableRow key={user?.id}>
                  <TableCell align="center"> {idx + 1} </TableCell>
                  <TableCell> {user?.firstName} </TableCell>
                  <TableCell> {user?.email} </TableCell>
                  <TableCell>
                    <Button
                      sx={{ color: 'error.main' }}
                      onClick={() => {
                        confirm.onTrue();
                        setSelectedUser(user);
                      }}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
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
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to remove user from this group?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow(selectedUser.id);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
};
export default PGUserTable;

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
        order.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
