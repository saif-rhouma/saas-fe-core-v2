import { useRef, useState, useEffect, useCallback } from 'react';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  rectIntersection,
  getFirstCollision,
  MeasuringStrategy,
} from '@dnd-kit/core';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { hideScrollY } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { moveTask, moveColumn, useGetBoard } from 'src/actions/kanban';

import { EmptyContent } from 'src/components/empty-content';

import { kanbanClasses } from '../classes';
import { coordinateGetter } from '../utils';
import { KanbanColumn } from '../column/kanban-column';
import { KanbanTaskItem } from '../item/kanban-task-item';
import { KanbanColumnAdd } from '../column/kanban-column-add';
import { KanbanColumnSkeleton } from '../components/kanban-skeleton';
import { KanbanDragOverlay } from '../components/kanban-drag-overlay';

// ----------------------------------------------------------------------

const PLACEHOLDER_ID = 'placeholder';

const cssVars = {
  '--item-gap': '16px',
  '--item-radius': '12px',
  '--column-gap': '24px',
  '--column-width': '336px',
  '--column-radius': '16px',
  '--column-padding': '20px 16px 16px 16px',
};

// ----------------------------------------------------------------------
const columns = [
  {
    id: '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
    name: 'To do',
  },
  {
    id: '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
    name: 'In progress',
  },
  {
    id: '3-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
    name: 'Ready to test',
  },
  {
    id: '4-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
    name: 'Done',
  },
];

const datares = {
  board: {
    tasks: {
      '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1': [
        {
          id: '1-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
          due: ['2024-09-07T10:23:14+00:00', '2024-09-08T10:23:14+00:00'],
          status: 'To do',
          labels: [],
          comments: [],
          assignee: [],
          priority: 'low',
          attachments: [],
          reporter: {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          name: 'Prepare Monthly Financial Report',
          description:
            'Occaecati est et illo quibusdam accusamus qui. Incidunt aut et molestiae ut facere aut. Est quidem iusto praesentium excepturi harum nihil tenetur facilis. Ut omnis voluptates nihil accusantium doloribus eaque debitis.',
        },
        {
          id: '2-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
          due: ['2024-09-08T10:23:14+00:00', '2024-09-09T10:23:14+00:00'],
          status: 'To do',
          labels: ['Technology'],
          comments: [
            {
              id: 'afac6e45-1b41-4e2d-b8da-42213cc46934',
              name: 'Jayvion Simon',
              createdAt: '2024-09-06T10:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              messageType: 'text',
              message:
                'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
            },
          ],
          assignee: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
              name: 'Jayvion Simon',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            },
          ],
          priority: 'hight',
          attachments: [
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-12.webp',
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-13.webp',
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp',
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-15.webp',
          ],
          reporter: {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          name: 'Design New Marketing Campaign',
          description:
            'Atque eaque ducimus minima distinctio velit. Laborum et veniam officiis. Delectus ex saepe hic id laboriosam officia. Odit nostrum qui illum saepe debitis ullam. Laudantium beatae modi fugit ut. Dolores consequatur beatae nihil voluptates rem maiores.',
        },
        {
          id: '3-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
          due: ['2024-09-09T10:23:14+00:00', '2024-09-10T10:23:14+00:00'],
          status: 'To do',
          labels: ['Technology', 'Health and Wellness'],
          comments: [
            {
              id: 'afac6e45-1b41-4e2d-b8da-42213cc46934',
              name: 'Jayvion Simon',
              createdAt: '2024-09-06T10:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              messageType: 'text',
              message:
                'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
            },
            {
              id: '4dad999f-b96a-486a-9a50-f968fa3cc532',
              name: 'Lucian Obrien',
              createdAt: '2024-09-05T09:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              messageType: 'image',
              message: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-7.webp',
            },
          ],
          assignee: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
              name: 'Jayvion Simon',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
              name: 'Lucian Obrien',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
            },
          ],
          priority: 'medium',
          attachments: [],
          reporter: {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          name: 'Analyze Customer Feedback',
          description:
            'Rerum eius velit dolores. Explicabo ad nemo quibusdam. Voluptatem eum suscipit et ipsum et consequatur aperiam quia. Rerum nulla sequi recusandae illum velit quia quas. Et error laborum maiores cupiditate occaecati.',
        },
      ],
      '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2': [
        {
          id: '4-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
          due: ['2024-09-10T10:23:14+00:00', '2024-09-11T10:23:14+00:00'],
          status: 'In progress',
          labels: ['Technology', 'Health and Wellness', 'Travel'],
          comments: [
            {
              id: 'afac6e45-1b41-4e2d-b8da-42213cc46934',
              name: 'Jayvion Simon',
              createdAt: '2024-09-06T10:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              messageType: 'text',
              message:
                'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
            },
            {
              id: '4dad999f-b96a-486a-9a50-f968fa3cc532',
              name: 'Lucian Obrien',
              createdAt: '2024-09-05T09:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              messageType: 'image',
              message: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-7.webp',
            },
            {
              id: '5fd064f0-2a6f-4f99-92bc-9d272c4c6a7e',
              name: 'Deja Brady',
              createdAt: '2024-09-04T08:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              messageType: 'image',
              message: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-8.webp',
            },
          ],
          assignee: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
              name: 'Jayvion Simon',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
              name: 'Lucian Obrien',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
              name: 'Deja Brady',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
            },
          ],
          priority: 'hight',
          attachments: [],
          reporter: {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          name: 'Update Website Content',
          description:
            'Et non omnis qui. Qui sunt deserunt dolorem aut velit cumque adipisci aut enim. Nihil quis quisquam nesciunt dicta nobis ab aperiam dolorem repellat. Voluptates non blanditiis. Error et tenetur iste soluta cupiditate ratione perspiciatis et. Quibusdam aliquid nam sunt et quisquam non esse.',
        },
        {
          id: '5-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
          due: ['2024-09-11T10:23:14+00:00', '2024-09-12T10:23:14+00:00'],
          status: 'In progress',
          labels: ['Technology', 'Health and Wellness', 'Travel', 'Finance'],
          comments: [
            {
              id: 'afac6e45-1b41-4e2d-b8da-42213cc46934',
              name: 'Jayvion Simon',
              createdAt: '2024-09-06T10:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              messageType: 'text',
              message:
                'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
            },
            {
              id: '4dad999f-b96a-486a-9a50-f968fa3cc532',
              name: 'Lucian Obrien',
              createdAt: '2024-09-05T09:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              messageType: 'image',
              message: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-7.webp',
            },
            {
              id: '5fd064f0-2a6f-4f99-92bc-9d272c4c6a7e',
              name: 'Deja Brady',
              createdAt: '2024-09-04T08:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              messageType: 'image',
              message: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-8.webp',
            },
            {
              id: '77cee5ae-f41c-4b03-b31a-ffbb4c26e619',
              name: 'Harrison Stein',
              createdAt: '2024-09-03T07:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
              messageType: 'text',
              message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
            },
          ],
          assignee: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
              name: 'Jayvion Simon',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
              name: 'Lucian Obrien',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
              name: 'Deja Brady',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
              name: 'Harrison Stein',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
            },
          ],
          priority: 'medium',
          attachments: [],
          reporter: {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          name: 'Conduct Market Research',
          description:
            'Nihil ea sunt facilis praesentium atque. Ab animi alias sequi molestias aut velit ea. Sed possimus eos. Et est aliquid est voluptatem.',
        },
      ],
      '3-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3': [],
      '4-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4': [
        {
          id: '6-task-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
          due: ['2024-09-12T10:23:14+00:00', '2024-09-13T10:23:14+00:00'],
          status: 'Done',
          labels: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
          comments: [
            {
              id: 'afac6e45-1b41-4e2d-b8da-42213cc46934',
              name: 'Jayvion Simon',
              createdAt: '2024-09-06T10:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              messageType: 'text',
              message:
                'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
            },
            {
              id: '4dad999f-b96a-486a-9a50-f968fa3cc532',
              name: 'Lucian Obrien',
              createdAt: '2024-09-05T09:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              messageType: 'image',
              message: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-7.webp',
            },
            {
              id: '5fd064f0-2a6f-4f99-92bc-9d272c4c6a7e',
              name: 'Deja Brady',
              createdAt: '2024-09-04T08:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              messageType: 'image',
              message: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-8.webp',
            },
            {
              id: '77cee5ae-f41c-4b03-b31a-ffbb4c26e619',
              name: 'Harrison Stein',
              createdAt: '2024-09-03T07:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
              messageType: 'text',
              message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
            },
            {
              id: '7ee7d22e-e1d9-48c2-8350-8f2b0b43f8f4',
              name: 'Reece Chung',
              createdAt: '2024-09-02T06:23:14+00:00',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
              messageType: 'text',
              message:
                'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
            },
          ],
          assignee: [
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
              name: 'Jayvion Simon',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
              name: 'Lucian Obrien',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
              name: 'Deja Brady',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
              name: 'Harrison Stein',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
            },
            {
              id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
              name: 'Reece Chung',
              avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            },
          ],
          priority: 'low',
          attachments: [
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp',
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-6.webp',
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-7.webp',
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-8.webp',
            'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-9.webp',
          ],
          reporter: {
            id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          name: 'Develop Software Application',
          description:
            'Non rerum modi. Accusamus voluptatem odit nihil in. Quidem et iusto numquam veniam culpa aperiam odio aut enim. Quae vel dolores. Pariatur est culpa veritatis aut dolorem.',
        },
      ],
    },
    columns: [
      {
        id: '1-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        name: 'To do',
      },
      {
        id: '2-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        name: 'In progress',
      },
      {
        id: '3-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        name: 'Ready to test',
      },
      {
        id: '4-column-e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        name: 'Done',
      },
    ],
  },
};

/** *************************** */

export function KanbanView() {
  const { board, boardLoading, boardEmpty } = useGetBoard();

  const [columnFixed, setColumnFixed] = useState(true);

  const recentlyMovedToNewContainer = useRef(false);

  const lastOverId = useRef(null);

  const [activeId, setActiveId] = useState(null);

  const columnIds = board.columns.map((column) => column.id);

  const isSortingContainer = activeId ? columnIds.includes(activeId) : false;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeId && activeId in board.tasks) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (column) => column.id in board.tasks
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);

      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in board.tasks) {
          const columnItems = board.tasks[overId].map((task) => task.id);

          // If a column is matched and it contains items (columns 'A', 'B', 'C')
          if (columnItems.length > 0) {
            // Return the closest droppable within that column
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (column) => column.id !== overId && columnItems.includes(column.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new column, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new column, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, board?.tasks]
  );

  const findColumn = (id) => {
    if (id in board.tasks) {
      return id;
    }

    return Object.keys(board.tasks).find((key) =>
      board.tasks[key].map((task) => task.id).includes(id)
    );
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, []);

  /**
   * onDragStart
   */
  const onDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  /**
   * onDragOver
   */
  const onDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (overId == null || active.id in board.tasks) {
      return;
    }

    const overColumn = findColumn(overId);

    const activeColumn = findColumn(active.id);

    if (!overColumn || !activeColumn) {
      return;
    }

    if (activeColumn !== overColumn) {
      const activeItems = board.tasks[activeColumn].map((task) => task.id);
      const overItems = board.tasks[overColumn].map((task) => task.id);
      const overIndex = overItems.indexOf(overId);
      const activeIndex = activeItems.indexOf(active.id);

      let newIndex;

      if (overId in board.tasks) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      recentlyMovedToNewContainer.current = true;

      const updateTasks = {
        ...board.tasks,
        [activeColumn]: board.tasks[activeColumn].filter((task) => task.id !== active.id),
        [overColumn]: [
          ...board.tasks[overColumn].slice(0, newIndex),
          board.tasks[activeColumn][activeIndex],
          ...board.tasks[overColumn].slice(newIndex, board.tasks[overColumn].length),
        ],
      };

      moveTask(updateTasks);
    }
  };

  /**
   * onDragEnd
   */
  const onDragEnd = ({ active, over }) => {
    if (active.id in board.tasks && over?.id) {
      const activeIndex = columnIds.indexOf(active.id);
      const overIndex = columnIds.indexOf(over.id);

      const updateColumns = arrayMove(board.columns, activeIndex, overIndex);

      moveColumn(updateColumns);
    }

    const activeColumn = findColumn(active.id);

    if (!activeColumn) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overColumn = findColumn(overId);

    if (overColumn) {
      const activeContainerTaskIds = board.tasks[activeColumn].map((task) => task.id);
      const overContainerTaskIds = board.tasks[overColumn].map((task) => task.id);

      const activeIndex = activeContainerTaskIds.indexOf(active.id);
      const overIndex = overContainerTaskIds.indexOf(overId);

      if (activeIndex !== overIndex) {
        const updateTasks = {
          ...board.tasks,
          [overColumn]: arrayMove(board.tasks[overColumn], activeIndex, overIndex),
        };

        moveTask(updateTasks);
      }
    }

    setActiveId(null);
  };

  const renderLoading = (
    <Stack direction="row" alignItems="flex-start" sx={{ gap: 'var(--column-gap)' }}>
      <KanbanColumnSkeleton />
    </Stack>
  );

  const renderEmpty = <EmptyContent filled sx={{ py: 10, maxHeight: { md: 480 } }} />;

  const renderList = (
    <DndContext
      id="dnd-kanban"
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Stack sx={{ flex: '1 1 auto', overflowX: 'auto' }}>
        <Stack
          sx={{
            pb: 3,
            display: 'unset',
            ...(columnFixed && { minHeight: 0, display: 'flex', flex: '1 1 auto' }),
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 'var(--column-gap)',
              ...(columnFixed && {
                minHeight: 0,
                flex: '1 1 auto',
                [`& .${kanbanClasses.columnList}`]: { ...hideScrollY, flex: '1 1 auto' },
              }),
            }}
          >
            <SortableContext
              items={[...columnIds, PLACEHOLDER_ID]}
              strategy={horizontalListSortingStrategy}
            >
              {board?.columns.map((column) => (
                <KanbanColumn key={column.id} column={column} tasks={board.tasks[column.id]}>
                  <SortableContext
                    items={board.tasks[column.id]}
                    strategy={verticalListSortingStrategy}
                  >
                    {board.tasks[column.id].map((task) => (
                      <KanbanTaskItem
                        task={task}
                        key={task.id}
                        columnId={column.id}
                        disabled={isSortingContainer}
                      />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              ))}

              <KanbanColumnAdd id={PLACEHOLDER_ID} />
            </SortableContext>
          </Stack>
        </Stack>
      </Stack>

      <KanbanDragOverlay
        columns={board?.columns}
        tasks={board?.tasks}
        activeId={activeId}
        sx={cssVars}
      />
    </DndContext>
  );

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        ...cssVars,
        pb: 0,
        pl: { sm: 3 },
        pr: { sm: 0 },
        flex: '1 1 0',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pr: { sm: 3 }, mb: { xs: 3, md: 5 } }}
      >
        <Typography variant="h4">Kanban</Typography>

        <FormControlLabel
          label="Column fixed"
          labelPlacement="start"
          control={
            <Switch
              checked={columnFixed}
              onChange={(event) => {
                setColumnFixed(event.target.checked);
              }}
              inputProps={{ id: 'column-fixed-switch' }}
            />
          }
        />
      </Stack>

      {boardLoading ? renderLoading : <>{boardEmpty ? renderEmpty : renderList}</>}
    </DashboardContent>
  );
}
