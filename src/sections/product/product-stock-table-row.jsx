import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Stack, Avatar, MenuItem, MenuList } from '@mui/material';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

const ProductStockTableRow = ({ row, index, selected, onEditRow }) => {
  const popover = usePopover();
  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{index || row?.id}</TableCell>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar
            alt={row?.name}
            src={CONFIG.site.serverFileHost + (row?.image || CONFIG.site.defaultImgPlaceHolder)}
          />
          <Box component="span">{row?.name}</Box>
        </Stack>
      </TableCell>
      <TableCell>{row.quantity}</TableCell>
      {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell> */}
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
          <MenuItem
            onClick={() => {
              onEditRow(row.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
};
export default ProductStockTableRow;
