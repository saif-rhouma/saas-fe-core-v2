import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PlanTableToolbar({ filters, onResetPage }) {
  const [selectedStatus, setSelectedStatus] = useState('all');
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

  return (
    <Stack
      spacing={2}
      justifyContent={{ xs: 'space-between' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <TextField
        sx={{ width: 420 }}
        value={filters.state.name}
        onChange={handleFilterName}
        placeholder="Search by product or plan number..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
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