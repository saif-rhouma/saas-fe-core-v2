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

const TicketsTableRow = ({ row, index, selected, onViewRow, onViewFileRow, onDeleteRow }) => {
  const confirm = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{index || row.id}</TableCell>
      <TableCell>{fDate(row.createTime)}</TableCell>
      <TableCell>{row.topic}</TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row.priority === 'Low' && 'success') ||
            (row.priority === 'Medium' && 'warning') ||
            (row.priority === 'Hight' && 'error') ||
            'default'
          }
        >
          {row.priority}
        </Label>
      </TableCell>
      <TableCell>{fDate(row.updateTime)}</TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'Open' && 'info') || (row.status === 'Closed' && 'default') || 'default'
          }
        >
          {row.status}
        </Label>
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
          {row?.file && (
            <MenuItem
              onClick={() => {
                onViewFileRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:cloud-download-bold" />
              Download
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
          <PermissionAccessController permission={PermissionsType.DELETE_TICKET}>
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
export default TicketsTableRow;
