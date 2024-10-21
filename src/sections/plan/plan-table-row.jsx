import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { PermissionsType } from 'src/utils/constant';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';

// ----------------------------------------------------------------------

export function PlanTableRow({ row, index, selected, onViewRow, onEditRow, onDeleteRow }) {
  const confirm = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Link color="inherit" onClick={onViewRow} underline="always" sx={{ cursor: 'pointer' }}>
          {row?.ref || index || row?.id}
        </Link>
      </TableCell>

      <TableCell>{fDate(row.planDate)}</TableCell>

      <TableCell>{row.product.name}</TableCell>

      <TableCell align="center"> {row.quantity} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'Ready' && 'success') ||
            (row.status === 'Pending' && 'info') ||
            (row.status === 'ProcessingA' && 'warning') ||
            (row.status === 'ProcessingB' && 'error') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>

      <TableCell>
        {row.createdBy?.firstName} {row.createdBy?.lastName}
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
          <PermissionAccessController permission={PermissionsType.VIEW_PLAN}>
            <MenuItem
              onClick={() => {
                onViewRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:eye-bold" />
              View
            </MenuItem>
          </PermissionAccessController>
          <PermissionAccessController permission={PermissionsType.EDIT_PLAN}>
            <MenuItem
              onClick={() => {
                onEditRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
          </PermissionAccessController>
          <PermissionAccessController permission={PermissionsType.DELETE_PLAN}>
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
}
