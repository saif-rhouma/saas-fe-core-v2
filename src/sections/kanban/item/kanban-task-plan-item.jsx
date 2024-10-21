import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';

import { useBoolean } from 'src/hooks/use-boolean';

import { imageClasses } from 'src/components/image';

import ItemPlanBase from './item-plan-base';

// ----------------------------------------------------------------------

export function KanbanTaskPlanItem({ task, disabled, columnId, sx }) {
  const openDetails = useBoolean();

  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id: task?.id,
  });

  const mounted = useMountStatus();

  const mountedWhileDragging = isDragging && !mounted;

  return (
    <ItemPlanBase
      ref={disabled ? undefined : setNodeRef}
      task={task}
      onClick={openDetails.onTrue}
      stateProps={{
        transform,
        listeners,
        transition,
        sorting: isSorting,
        dragging: isDragging,
        fadeIn: mountedWhileDragging,
      }}
      sx={{ ...(openDetails.value && { [`& .${imageClasses.root}`]: { opacity: 0.8 } }), ...sx }}
    />
  );
}

// ----------------------------------------------------------------------

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
