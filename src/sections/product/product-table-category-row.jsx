import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Stack, Avatar } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { usePopover } from 'src/components/custom-popover';

const ProductCategoryTableRow = ({ row, index, selected }) => {
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

      <TableCell>{fCurrency(row?.price)}</TableCell>

      <TableCell align="center"> {row?.stock?.quantity || '0'} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row.isActive === true && 'success') || (row.isActive === false && 'error') || 'default'
          }
        >
          {row?.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Label>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
};
export default ProductCategoryTableRow;
