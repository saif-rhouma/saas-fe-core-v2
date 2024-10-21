import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { usePopover } from 'src/components/custom-popover';

const ReportsOrderTableRow = ({ row, selected, onViewRow, onSelectRow, onDeleteRow }) => {
  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

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
