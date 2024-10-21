import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const ReportsDailyTableRow = ({ row, selected }) => {
  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{row?.label}</TableCell>
      <TableCell>{row?.value}</TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
};
export default ReportsDailyTableRow;
