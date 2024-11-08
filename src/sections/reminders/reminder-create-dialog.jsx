import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { Button, DialogTitle, DialogActions } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewReminderSchema = zod.object({
  title: zod.string().min(1, { message: 'title is required!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  date: schemaHelper.date({ message: { required_error: 'Date is required!' } }),
  time: schemaHelper.date({ message: { required_error: 'Time is required!' } }),
});

const ReminderCreateDialog = ({ currentReminder, quotation, open, onClose, handler }) => {
  const store = useRef(currentReminder);
  //! Upload Logic START
  const [file, setFile] = useState();

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    setFile(() => newFile);
  }, []);

  const handleDelete = () => {
    setFile(null);
  };

  const queryClient = useQueryClient();
  const uploadConfig = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  const { mutate: handleUploadReminderFile } = useMutation({
    mutationFn: (fnFile) => axios.post(endpoints.files.upload, fnFile, uploadConfig),
    onSuccess: async ({ data }) => {
      const { name: filename } = data;
      if (filename) {
        const { current: payload } = store;
        payload.file = filename;
        delete payload.time;
        delete payload.date;
        if (currentReminder) {
          await handler({ id: currentReminder.id, payload });
        } else {
          await handler(payload);
        }
      }
      return data;
    },
    onSettled: async () => {
      setFile(null);
      await queryClient.invalidateQueries({ queryKey: ['reminders-images'] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //! Upload Logic END

  const defaultValues = useMemo(
    () => ({
      title: currentReminder?.title || '',
      description: currentReminder?.description || '',
      date: currentReminder?.reminderDate || dayjs(),
      time: currentReminder?.reminderDate || dayjs(),
    }),
    [currentReminder]
  );

  useEffect(() => {
    if (currentReminder) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReminder]);

  const methods = useForm({
    resolver: zodResolver(NewReminderSchema),
    defaultValues,
  });

  const { mutate: handleCreateReminder } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.reminders.create, payload),
    onSuccess: async () => {
      toast.success('New Reminder Has Been Created!');
      await queryClient.invalidateQueries({ queryKey: ['reminders'] });
      if (quotation) {
        const { id } = quotation;
        await queryClient.invalidateQueries({ queryKey: ['quotation', id] });
      }
    },
    onSettled: async () => {
      onClose();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (payload) => {
    try {
      const date = dayjs(payload.date).format('YYYY-MM-DD');
      const time = dayjs(payload.time).format('HH:mm:ss');
      const datetime = dayjs(`${date}T${time}`).toISOString();
      payload.reminderDate = datetime;

      if (file) {
        store.current = { ...payload };
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'Reminder');
        await handleUploadReminderFile(formData);
      } else if (currentReminder) {
        await handler({ id: currentReminder.id, payload });
      } else {
        if (quotation) {
          payload.quotationId = quotation.id;
        }
        await handleCreateReminder(payload);
      }
      onClose();
      store.current = {};
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{currentReminder ? 'Edit Reminder' : 'Add Reminder'}</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Divider />
          <Stack spacing={2} sx={{ pt: 4, pb: 1 }}>
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
            >
              <Field.DatePicker fullWidth label="Date" name="date" sx={{ flexGrow: 1 }} />
              <Field.TimePicker label="Time" name="time" sx={{ flexGrow: 1 }} />
              <Field.Text fullWidth name="title" label="Title" sx={{ flexGrow: 1 }} />
              <Field.Text fullWidth name="description" label="Description" sx={{ flexGrow: 1 }} />
            </Box>
            <Box>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Attachments</Typography>
                <Scrollbar sx={{ maxHeight: 360, p: 2 }}>
                  <Upload value={file} onDrop={handleDropSingleFile} onDelete={handleDelete} />
                </Scrollbar>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" variant="contained">
            {currentReminder ? 'Save Changes' : 'Save'}
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
export default ReminderCreateDialog;
