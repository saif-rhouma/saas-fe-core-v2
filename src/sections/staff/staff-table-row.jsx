import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { PermissionsType } from 'src/utils/constant';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';

const StaffTableRow = ({ row, index, selected, onEditRow, onDeleteRow, handler }) => {
  const confirm = useBoolean();

  const popover = usePopover();
  const [isChecked, setIsChecked] = useState(row?.isActive);

  useEffect(() => {
    setIsChecked(row?.isActive);
  }, [row]);

  const handleStatusChange = (id) => () => {
    setIsChecked(!isChecked);
    handler({ id, payload: { isActive: !isChecked } });
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{index || row?.id}</TableCell>
      <TableCell>{`${row?.firstName} ${row?.lastName || ''}`}</TableCell>
      <TableCell>{row?.phoneNumber || '-'}</TableCell>
      <TableCell>{row?.email}</TableCell>
      <TableCell>
        <Switch checked={isChecked} onChange={handleStatusChange(row.id)} color="primary" />
      </TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <PermissionAccessController permission={PermissionsType.EDIT_STAFF}>
            <MenuItem
              onClick={() => {
                onEditRow();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
          </PermissionAccessController>
          <PermissionAccessController permission={PermissionsType.DELETE_STAFF}>
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </PermissionAccessController>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
};
export default StaffTableRow;
