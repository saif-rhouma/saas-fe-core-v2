import FinancialCreateDialog from './financial-create-dialog';

const FinancialEditDialog = ({ financial, open, onClose, handler }) => (
  <FinancialCreateDialog financial={financial} open={open} onClose={onClose} handler={handler} />
);
export default FinancialEditDialog;
