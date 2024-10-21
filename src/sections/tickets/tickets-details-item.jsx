import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import TicketsCloseDialog from './tickets-close-dialog';
import TicketUserTable from './ticket-user-table';
// ----------------------------------------------------------------------

export function TicketDetailsItems({ ticket }) {
  const confirm = useBoolean();
  const queryClient = useQueryClient();

  const { mutate: closeTicket } = useMutation({
    mutationFn: (id) => axios.patch(endpoints.tickets.close + id, { status: 'Closed' }),
    onSuccess: async () => {
      toast.success('Closed success!');
      confirm.onFalse();
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (err) => {},
  });

  return (
    <>
      <Card>
        <CardHeader title="Details" />
        <Stack sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              typography: 'body2',
            }}
          >
            <Box
              flexDirection="column"
              sx={{
                display: 'flex',
                width: '100%',
                p: 1,
              }}
            >
              <Stack direction="row" sx={{ typography: 'subtitle2', marginBottom: 1 }}>
                <div>Ticket Details</div>
              </Stack>
              <Box sx={{ color: 'text.secondary' }}>TICKET ID: {ticket?.id}</Box>
              <Box sx={{ color: 'text.secondary' }}>
                Member: {`${ticket?.member.firstName} ${ticket?.member.lastName || ''}`}
              </Box>
              <Box sx={{ color: 'text.secondary' }}>Topic: {ticket?.topic}.</Box>
            </Box>
            <Box
              flexDirection="column"
              alignItems="center"
              gap={0.5}
              sx={{
                display: 'flex',
                width: '100%',
                p: 1,
                borderRight: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
                borderLeft: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
              }}
            >
              <Stack
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ typography: 'subtitle2', width: '100%', marginBottom: 1 }}
              >
                <div>Ticket Status</div>
              </Stack>
              <Box sx={{ color: 'text.secondary' }}>
                <Label
                  variant="soft"
                  color={
                    (ticket.status === 'Open' && 'info') ||
                    (ticket.status === 'Closed' && 'default') ||
                    'default'
                  }
                >
                  {ticket.status}
                </Label>
              </Box>
            </Box>
            <Box
              flexDirection="column"
              alignItems="center"
              sx={{
                p: 1,
                display: 'flex',
                width: '100%',
              }}
            >
              <Stack
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={1}
                sx={{ typography: 'subtitle2', width: '100%', marginBottom: 1 }}
              >
                <div>Ticket Priority</div>
              </Stack>
              <Box sx={{ color: 'text.secondary' }}>
                <Label
                  variant="soft"
                  color={
                    (ticket?.priority === 'Low' && 'success') ||
                    (ticket?.priority === 'Medium' && 'warning') ||
                    (ticket?.priority === 'Hight' && 'error') ||
                    'default'
                  }
                >
                  {ticket?.priority}
                </Label>
              </Box>
            </Box>
          </Stack>
          <Box sx={{ pt: 5 }}>
            <Button
              onClick={confirm.onTrue}
              disabled={ticket.status === 'Closed'}
              variant="contained"
              startIcon={<Iconify icon="carbon:checkmark-filled" />}
            >
              Mark as Closed
            </Button>
          </Box>
          <CardHeader title="Users" />
          <Box
            fullWidth
            alignItems="center"
            sx={{
              p: 3,
            }}
          >
            <TicketUserTable users={ticket?.mentions} />
          </Box>
        </Stack>
      </Card>
      <TicketsCloseDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        handler={() => closeTicket(ticket.id)}
      />
    </>
  );
}
