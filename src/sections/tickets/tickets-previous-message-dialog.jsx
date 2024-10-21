import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import TimelineDot from '@mui/lab/TimelineDot';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

const TicketsPreviousMessageDialog = ({ history, customer }) => {
  const renderTimeline = (
    <Box sx={{ pb: 4, pt: 2 }}>
      <Stack sx={{ typography: 'subtitle1', width: '100%', marginBottom: 1 }}>
        <div>Previous Messages:</div>
      </Stack>
      <Scrollbar sx={{ px: 3, pb: 3, pt: 2, height: 200 }}>
        <Timeline
          sx={{ p: 0, m: 0, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}
        >
          {history?.timeline.map((item, index) => {
            const firstTimeline = index === 0;

            const lastTimeline = index === history.timeline.length - 1;

            return (
              <TimelineItem key={item.title}>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  {lastTimeline ? null : <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">{customer.name}</Typography>

                      <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                        {item.title}
                      </Box>
                    </Box>
                    <Box sx={{ color: 'text.disabled', typography: 'caption' }}>
                      {fDate(item.time)}
                    </Box>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </Scrollbar>
      <Stack justifyContent="flex-end" spacing={1} sx={{ marginTop: 1 }}>
        <Stack sx={{ typography: 'subtitle1', width: '100%', marginBottom: 1 }}>
          <div>Send Reply:</div>
        </Stack>
        <TextField label="Enter Description" name="description" multiline rows={3} sx={{ mb: 2 }} />
        <Box>
          <Button variant="contained" endIcon={<Iconify icon="iconamoon:send-fill" />}>
            Send
          </Button>
        </Box>
      </Stack>
    </Box>
  );

  return <>{renderTimeline}</>;
};
export default TicketsPreviousMessageDialog;
