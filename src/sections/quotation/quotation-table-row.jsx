/* eslint-disable no-unsafe-optional-chaining */
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { PermissionsType } from 'src/utils/constant';
import { calculateAfterTax } from 'src/utils/helper';

import { CONFIG } from 'src/config-global';
import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';

// ----------------------------------------------------------------------

export function QuotationTableRow({
  row,
  index,
  selected,
  onViewRow,
  onClickRow,
  onEditRow,
  onDeleteRow,
  isFullDisplay,
}) {
  const confirm = useBoolean();
  const { t } = useTranslate('quotations');
  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell onClick={onClickRow}>
        <Link color="inherit" onClick={onViewRow} underline="always" sx={{ cursor: 'pointer' }}>
          {row?.ref || index || row?.id}
        </Link>
      </TableCell>

      <TableCell onClick={onClickRow}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar alt={row.name} src={row.customer.avatar} />

          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Box component="span">{row.name}</Box>
            <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.customer.name}
            </Box>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell onClick={onClickRow}>
        <ListItemText
          primary={fDate(row.quotationDate)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center" onClick={onClickRow}>
        <AvatarGroup sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 24, height: 24 } }}>
          {row?.productToQuotation?.map((op) => (
            <Tooltip
              key={op?.product?.id}
              title={`${op?.product?.name} | Quantity : ${op.quantity}`}
            >
              <Avatar
                key={op?.id}
                alt={op?.product?.name}
                src={`${CONFIG.site.serverFileHost}${op?.product?.image}`}
              />
            </Tooltip>
          ))}
        </AvatarGroup>
      </TableCell>
      <TableCell onClick={onClickRow}>
        {fCurrency(
          calculateAfterTax(
            row?.totalAmount - row?.totalAmount * (row?.discount / 100),
            row?.snapshotTaxPercentage
          )
        ) || '-'}{' '}
      </TableCell>
      {!isFullDisplay && (
        <TableCell onClick={onClickRow}>
          {row.createdBy?.firstName} {row.createdBy?.lastName}
        </TableCell>
      )}
      {!isFullDisplay && (
        <TableCell onClick={onClickRow}>
          <Label
            variant="soft"
            color={
              (row.status === 'InProcess' && 'warning') ||
              (row.status === 'Confirmed' && 'success') ||
              (row.status === 'Canceled' && 'error') ||
              'default'
            }
          >
            {row.status === 'Draft' && `${t('listView.table.tableToolbar.selectMenu.draft')}`}
            {row.status === 'InProcess' &&
              `${t('listView.table.tableToolbar.selectMenu.processing')}`}
            {row.status === 'Confirmed' &&
              `${t('listView.table.tableToolbar.selectMenu.confirmed')}`}
            {row.status === 'Canceled' && `${t('listView.table.tableToolbar.selectMenu.canceled')}`}
          </Label>
        </TableCell>
      )}
      {!isFullDisplay && (
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={collapse.value ? 'inherit' : 'default'}
            onClick={collapse.onToggle}
            sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.productToQuotation.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                }}
              >
                <ListItemText
                  primary={item.product.name}
                  secondary={item.sku}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />

                <div>x{item.quantity} </div>

                <Box sx={{ width: 110, textAlign: 'right' }}>
                  {fCurrency(item.snapshotProductPrice)}
                </Box>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <PermissionAccessController permission={PermissionsType.VIEW_QUOTATION}>
            <MenuItem
              onClick={() => {
                onViewRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:eye-bold" />
              {`${t('listView.table.tableActions.view')}`}
            </MenuItem>
          </PermissionAccessController>
          {row?.status === 'Draft' && (
            <PermissionAccessController permission={PermissionsType.EDIT_QUOTATION}>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:pen-bold" />
                {`${t('listView.table.tableActions.edit')}`}
              </MenuItem>
            </PermissionAccessController>
          )}
          {row.status !== 'Canceled' && (
            <PermissionAccessController permission={PermissionsType.DELETE_QUOTATION}>
              <MenuItem
                onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                }}
                sx={{ color: 'warning.main' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
                {`${t('listView.table.tableActions.cancel')}`}
              </MenuItem>
            </PermissionAccessController>
          )}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Cancel Quotation"
        content="Are you sure want to cancel this quotation?"
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Confirm Canceling
          </Button>
        }
      />
    </>
  );
}
