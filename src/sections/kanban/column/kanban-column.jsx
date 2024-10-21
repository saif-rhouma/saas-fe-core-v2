import { CSS } from '@dnd-kit/utilities';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';

import ColumnBase from './column-base';
import { KanbanColumnToolBar } from './kanban-column-toolbar';

// ----------------------------------------------------------------------

export function KanbanColumn({ children, column, tasks, disabled, sx }) {
  const { attributes, isDragging, listeners, setNodeRef, transition, active, over, transform } =
    useSortable({
      id: column.id,
      data: { type: 'container', children: tasks },
      animateLayoutChanges,
    });

  const tasksIds = tasks?.map((task) => task.id);

  const isOverContainer = over
    ? (column.id === over.id && active?.data.current?.type !== 'container') ||
      tasksIds.includes(over.id)
    : false;

  return (
    <ColumnBase
      ref={disabled ? undefined : setNodeRef}
      sx={{ transition, transform: CSS.Translate.toString(transform), ...sx }}
      stateProps={{
        dragging: isDragging,
        hover: isOverContainer,
        handleProps: { ...attributes, ...listeners },
      }}
      slots={{
        header: <KanbanColumnToolBar totalTasks={tasks.length} columnName={column.name} />,
        main: <>{children}</>,
      }}
    />
  );
}

// ----------------------------------------------------------------------

const animateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });
