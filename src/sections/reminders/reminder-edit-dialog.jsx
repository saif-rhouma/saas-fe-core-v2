import ReminderCreateDialog from './reminder-create-dialog';

const ReminderEditDialog = ({ reminder, open, onClose, handler }) => (
  <ReminderCreateDialog
    currentReminder={reminder}
    open={open}
    onClose={onClose}
    handler={handler}
  />
);
export default ReminderEditDialog;
