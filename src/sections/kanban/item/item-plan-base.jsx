import { memo, useEffect, forwardRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { varAlpha, stylesMode } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';

import { kanbanClasses } from '../classes';

// ----------------------------------------------------------------------

export const StyledItemWrap = styled(ListItem)(() => ({
  '@keyframes fadeIn': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
  transform:
    'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))',
  transformOrigin: '0 0',
  touchAction: 'manipulation',
  [`&.${kanbanClasses.state.fadeIn}`]: { animation: 'fadeIn 500ms ease' },
  [`&.${kanbanClasses.state.dragOverlay}`]: { zIndex: 999 },
}));

export const StyledItem = styled(Stack)(({ theme }) => ({
  width: '100%',
  cursor: 'grab',
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  transformOrigin: '50% 50%',
  touchAction: 'manipulation',
  boxShadow: theme.customShadows.z1,
  borderRadius: 'var(--item-radius)',
  WebkitTapHighlightColor: 'transparent',
  backgroundColor: theme.vars.palette.common.white,
  transition: theme.transitions.create(['box-shadow']),
  [stylesMode.dark]: { backgroundColor: theme.vars.palette.grey[900] },
  [`&.${kanbanClasses.state.disabled}`]: {},
  [`&.${kanbanClasses.state.sorting}`]: {},
  [`&.${kanbanClasses.state.dragOverlay}`]: {
    backdropFilter: `blur(6px)`,
    boxShadow: theme.customShadows.z20,
    backgroundColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.48),
    [stylesMode.dark]: { backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48) },
  },
  [`&.${kanbanClasses.state.dragging}`]: { opacity: 0.2, filter: 'grayscale(1)' },
}));

const ItemPlanBase = forwardRef(({ task, stateProps, sx, ...other }, ref) => {
  useEffect(() => {
    if (!stateProps?.dragOverlay) {
      return;
    }

    document.body.style.cursor = 'grabbing';

    // eslint-disable-next-line consistent-return
    return () => {
      document.body.style.cursor = '';
    };
  }, [stateProps?.dragOverlay]);

  const itemWrapClassName = kanbanClasses.itemWrap.concat(
    (stateProps?.fadeIn && ` ${kanbanClasses.state.fadeIn}`) ||
      (stateProps?.dragOverlay && ` ${kanbanClasses.state.dragOverlay}`) ||
      ''
  );

  const itemClassName = kanbanClasses.item.concat(
    (stateProps?.dragging && ` ${kanbanClasses.state.dragging}`) ||
      (stateProps?.disabled && ` ${kanbanClasses.state.disabled}`) ||
      (stateProps?.sorting && ` ${kanbanClasses.state.sorting}`) ||
      (stateProps?.dragOverlay && ` ${kanbanClasses.state.dragOverlay}`) ||
      ''
  );

  /*


 (row.status === 'Ready' && 'success') ||
            (row.status === 'Pending' && 'info') ||
            (row.status === 'ProcessingA' && 'warning') ||
            (row.status === 'ProcessingB' && 'error') ||

  */

  const renderPriority = (
    <Iconify
      icon={
        task.status === 'Delivered'
          ? 'solar:double-alt-arrow-up-bold-duotone'
          : 'solar:double-alt-arrow-right-bold-duotone'
      }
      sx={{
        top: 4,
        right: 4,
        position: 'absolute',
        ...(task.status === 'ProcessingA' && { color: 'warning.main' }),
        ...(task.status === 'Ready' && { color: 'success.main' }),
        ...(task.status === 'Pending' && { color: 'info.main' }),
        ...(task.status === 'ProcessingB' && { color: 'error.main' }),
      }}
    />
  );

  const renderInfo = (
    <Stack direction="row" alignItems="center">
      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        sx={{ typography: 'caption', color: 'text.disabled' }}
      >
        <Box component="span" sx={{ mr: 1 }}>
          Product:
        </Box>
      </Stack>

      <AvatarGroup sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 24, height: 24 } }}>
        <Avatar
          key={task?.product?.id}
          alt={task?.product?.name}
          src={`${CONFIG.site.serverFileHost}${task?.product?.image}`}
        />
      </AvatarGroup>
    </Stack>
  );

  return (
    <StyledItemWrap
      ref={ref}
      disablePadding
      className={itemWrapClassName}
      sx={{
        ...(!!stateProps?.transition && { transition: stateProps.transition }),
        ...(!!stateProps?.transform && {
          '--translate-x': `${Math.round(stateProps.transform.x)}px`,
          '--translate-y': `${Math.round(stateProps.transform.y)}px`,
          '--scale-x': `${stateProps.transform.scaleX}`,
          '--scale-y': `${stateProps.transform.scaleY}`,
        }),
      }}
    >
      <StyledItem
        className={itemClassName}
        data-cypress="draggable-item"
        sx={sx}
        tabIndex={0}
        {...stateProps?.listeners}
        {...other}
      >
        <Stack spacing={1} sx={{ px: 2, py: 2.5, position: 'relative' }}>
          {renderPriority}
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">{task?.product?.name}</Typography>
            <Typography variant="subtitle2">PLAN-{task?.id}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ typography: 'body2' }}>
            <Box sx={{ color: 'text.secondary' }}>Plan Date:</Box>
            <Box sx={{ color: 'text.secondary' }}>{fDate(task?.planDate)}</Box>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ typography: 'body2' }}>
            <Box sx={{ color: 'text.secondary' }}>Quantity:</Box>
            <Box sx={{ color: 'text.secondary' }}>{task.quantity ? task.quantity : '-'}</Box>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ typography: 'body2' }}>
            <Box sx={{ color: 'text.secondary' }}>Last Updated Date:</Box>
            <Box sx={{ color: 'text.secondary' }}>{fDate(task?.updateTime)}</Box>
          </Stack>

          {renderInfo}
        </Stack>
      </StyledItem>
    </StyledItemWrap>
  );
});

export default memo(ItemPlanBase);
