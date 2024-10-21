import { useRef, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { usePopover } from 'src/components/custom-popover';

import { KanbanInputName } from '../components/kanban-input-name';

// ----------------------------------------------------------------------

export function KanbanColumnToolBar({ columnName, totalTasks }) {
  const renameRef = useRef(null);

  const popover = usePopover();

  const [name, setName] = useState(columnName);

  useEffect(() => {
    if (popover.open) {
      if (renameRef.current) {
        renameRef.current.focus();
      }
    }
  }, [popover.open]);

  return (
    <Stack direction="row" alignItems="center">
      <Label
        sx={{
          borderRadius: '50%',
          borderColor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.24),
        }}
      >
        {totalTasks}
      </Label>

      <KanbanInputName
        inputRef={renameRef}
        placeholder="Column name"
        value={name}
        inputProps={{ id: `input-column-${name}` }}
        sx={{ mx: 1 }}
      />
    </Stack>
  );
}
