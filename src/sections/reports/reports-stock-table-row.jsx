import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Stack, Avatar } from '@mui/material';

import { CONFIG } from 'src/config-global';

const ReportsStockTableRow = ({ row, selected }) => {
  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{row?.productId}</TableCell>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar
            alt={row?.name}
            src={CONFIG.site.serverFileHost + (row?.image || CONFIG.site.defaultImgPlaceHolder)}
          />
          <Box component="span">{row?.name}</Box>
        </Stack>
      </TableCell>
      <TableCell>{row?.totals_quantity}</TableCell>
      <TableCell>{row?.pending_quantity}</TableCell>
      <TableCell>{row?.processing_a_quantity}</TableCell>
      <TableCell>{row?.processing_b_quantity}</TableCell>
      <TableCell>{row?.ready_quantity}</TableCell>
      <TableCell>{row?.in_stock}</TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
};
export default ReportsStockTableRow;
