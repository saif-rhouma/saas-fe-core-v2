import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

const ReportsOrderTableRow = ({ row, selected, onViewRow, onSelectRow, onDeleteRow }) => {
  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{fDate(row?.orderDate)}</TableCell>
      <TableCell>{row?.ref}</TableCell>
      <TableCell>{row?.customer?.name}</TableCell>
      <TableCell>{fCurrency(row?.totalOrderAmount) || '-'}</TableCell>
      <TableCell>{row?.status}</TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
};
export default ReportsOrderTableRow;
