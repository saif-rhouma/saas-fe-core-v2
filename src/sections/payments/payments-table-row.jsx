import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { PermissionsType } from 'src/utils/constant';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';

const PaymentsTableRow = ({
  row,
  index,
  selected,
  onViewRow,
  onViewFileRow,
  onDeleteRow,
  onEditRow,
}) => {
  const confirm = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{index || row?.id}</TableCell>

      <TableCell>{fDate(row?.paymentDate)}</TableCell>
      <TableCell>{row?.customer?.name}</TableCell>
      <TableCell>{row?.order?.ref}</TableCell>
      <TableCell>{row?.amount}</TableCell>
      <TableCell>{row?.paymentType}</TableCell>
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
          {row?.attachments && (
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
          <PermissionAccessController permission={PermissionsType.VIEW_PAYMENT}>
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
          <PermissionAccessController permission={PermissionsType.EDIT_PAYMENT}>
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
          <PermissionAccessController permission={PermissionsType.DELETE_PAYMENT}>
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
export default PaymentsTableRow;
