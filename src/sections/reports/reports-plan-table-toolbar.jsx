import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Select, MenuItem, TextField, InputAdornment } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ReportsPlanTableToolbar({ filters, onResetPage }) {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [endDate, setEndDate] = useState(dayjs());

  const [startDate, setStartDate] = useState(dayjs());

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterStatus = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ status: newValue.target.value });
      setSelectedStatus(newValue.target.value);
    },
    [filters, onResetPage]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const onChangeEndDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ endDate: newValue });
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
      <TextField
        sx={{ flexGrow: 1 }}
        value={filters.state.name}
        onChange={handleFilterName}
        placeholder="Search customer or order number..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <DatePicker
        label="Start Date"
        sx={{ flexGrow: 1 }}
        format="DD/MM/YYYY"
        value={filters.state.startDate}
        onChange={handleFilterStartDate}
      />
      <DatePicker
        label="End Date"
        sx={{ flexGrow: 1 }}
        value={filters.state.endDate}
        onChange={onChangeEndDate}
        format="DD/MM/YYYY"
      />
      <Select
        sx={{ width: 420, textTransform: 'capitalize' }}
        value={selectedStatus}
        onChange={handleFilterStatus}
      >
        <MenuItem value="all">All Plans</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="ProcessingA">Processing-A</MenuItem>
        <MenuItem value="ProcessingB">Processing-B</MenuItem>
        <MenuItem value="Ready">Ready</MenuItem>
      </Select>
    </Stack>
  );
}
