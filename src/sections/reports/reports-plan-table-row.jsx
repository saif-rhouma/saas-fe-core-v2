import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDate } from 'src/utils/format-time';

const ReportsPlanTableRow = ({ row, selected }) => {
  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{fDate(row?.planDate)}</TableCell>
      <TableCell>{row?.ref}</TableCell>
      <TableCell>{row?.product?.name}</TableCell>
      <TableCell>{row?.quantity}</TableCell>
      <TableCell>{row?.status}</TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
};
export default ReportsPlanTableRow;
