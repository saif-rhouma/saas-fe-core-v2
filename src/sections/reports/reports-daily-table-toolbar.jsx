import dayjs from 'dayjs';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ----------------------------------------------------------------------

export function ReportsDailyTableToolbar({ filters, onResetPage }) {
  const handleFilterStartDate = useCallback(
    (newValue) => {
      const endDate = dayjs(newValue).add(1, 'day').format('YYYY-MM-DD');
      onResetPage();
      filters.setState({ startDate: newValue, endDate });
    },
    [filters, onResetPage]
  );

  return (
    <Stack
      spacing={2}
      justifyContent={{ xs: 'space-between' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <DatePicker
        label="Date"
        format="DD/MM/YYYY"
        value={filters.state.startDate}
        onChange={handleFilterStartDate}
      />
    </Stack>
  );
}
