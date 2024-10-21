import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import { Box, Stack, Paper, Avatar, Tooltip, Collapse } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { PermissionsType } from 'src/utils/constant';
import { calculateAfterTax } from 'src/utils/helper';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';

const ProductTableRow = ({ row, index, selected, onViewRow, onDeleteRow, onEditRow }) => {
  const [hasOrders, setHasOrders] = useState(row?.productToOrder?.length > 0);
  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();
  const router = useRouter();
  const handleViewOrder = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleViewProduct = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{index || row?.id}</TableCell>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar
            alt={row?.name}
            src={CONFIG.site.serverFileHost + (row?.image || CONFIG.site.defaultImgPlaceHolder)}
          />
          <Box component="span">{row?.name}</Box>
        </Stack>
      </TableCell>

      <TableCell>
        <AvatarGroup sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 24, height: 24 } }}>
          <Tooltip title={`${row?.category?.name}`}>
            <Avatar
              alt={row?.category?.name}
              src={`${CONFIG.site.serverFileHost}${row?.category?.image}`}
            />
          </Tooltip>
        </AvatarGroup>
      </TableCell>

      <TableCell>{fCurrency(row?.price)}</TableCell>

      <TableCell align="center"> {row?.stock?.quantity || '0'} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row.isActive === true && 'success') || (row.isActive === false && 'error') || 'default'
          }
        >
          {row?.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {hasOrders && (
          <IconButton
            color={collapse.value ? 'inherit' : 'default'}
            onClick={collapse.onToggle}
            sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>
        )}

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
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
            {row?.productToOrder?.map((item, idx) => {
              if (idx === 5) {
                return (
                  <Stack
                    key={item.id}
                    alignItems="flex-end"
                    sx={{
                      p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                      '&:not(:last-of-type)': {
                        borderBottom: (theme) =>
                          `solid 2px ${theme.vars.palette.background.neutral}`,
                      },
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<Iconify icon="heroicons-outline:external-link" />}
                      onClick={() => {
                        handleViewProduct(row.id);
                      }}
                    >
                      See More
                    </Button>
                  </Stack>
                );
              }
              return (
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
                  <Box
                    onClick={() => handleViewOrder(item?.order?.id)}
                    sx={{
                      width: 240,
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      cursor: 'pointer',
                      marginRight: 5,
                    }}
                  >
                    <Iconify icon="heroicons-outline:external-link" />
                    <span>{item?.order?.ref}</span>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      // cursor: 'pointer',
                    }}
                  >
                    {/* <Iconify icon="heroicons-outline:external-link" />{' '} */}
                    <span>{item.order?.customer?.name}</span>
                  </Box>

                  <Box sx={{ width: 240, color: 'error.main', fontWeight: 'bold' }}>
                    x{item.quantity}{' '}
                    <span
                      style={{
                        color: '#000',
                        fontWeight: '400',
                      }}
                    >{`(${fCurrency(item?.snapshotProductPrice)})`}</span>
                  </Box>

                  <Box sx={{ width: 200, textAlign: 'right' }}>{item.order?.status}</Box>
                  <Box sx={{ width: 300, textAlign: 'right' }}>
                    {fCurrency(
                      calculateAfterTax(
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        item.order?.totalOrderAmount -
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          item.order?.totalOrderAmount * (item.order?.discount / 100),
                        item.order?.snapshotTaxPercentage
                      )
                    ) || '-'}
                  </Box>
                </Stack>
              );
            })}
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
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
          <PermissionAccessController permission={PermissionsType.EDIT_PRODUCT}>
            <MenuItem
              onClick={() => {
                onEditRow(row.id);
                popover.onClose();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
          </PermissionAccessController>
          <PermissionAccessController permission={PermissionsType.DELETE_PRODUCT}>
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </PermissionAccessController>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
};
export default ProductTableRow;
