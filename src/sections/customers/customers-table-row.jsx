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

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';

const CustomersTableRow = ({ row, index, selected, onDeleteRow, onEditRow }) => {
  const [hasOrders, setHasOrders] = useState(row?.lastOrders.length > 0);

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const router = useRouter();

  const getFullAddress = (address) => {
    if (!address) {
      return ' - ';
    }
    return `${address?.street} ${address?.country}.`;
  };

  const handleViewOrder = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleViewCustomer = useCallback(
    (id) => {
      router.push(paths.dashboard.customers.details(id));
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
      <TableCell>{row?.ref || index || row?.id}</TableCell>

      <TableCell>{row?.name}</TableCell>
      <TableCell>{row?.email}</TableCell>
      <TableCell>{row?.phoneNumber}</TableCell>
      <TableCell>{getFullAddress(row?.address)}</TableCell>

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
            {row?.lastOrders.map((item, idx) => {
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
                        handleViewCustomer(row.id);
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
                    onClick={() => handleViewOrder(item?.id)}
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
                    <span>{item?.ref}</span>
                  </Box>

                  <Box sx={{ width: '100%', color: 'error.main', fontWeight: 'bold' }}>
                    <AvatarGroup
                      sx={{ [`& .${avatarGroupClasses.avatar}`]: { width: 24, height: 24 } }}
                    >
                      {item?.productToOrder?.map((op) => (
                        <Tooltip
                          key={op?.product?.id}
                          title={`${op?.product?.name} | Quantity : ${op.quantity}`}
                        >
                          <Avatar
                            key={op?.id}
                            sx={{ cursor: 'pointer' }}
                            alt={op?.product?.name}
                            src={`${CONFIG.site.serverFileHost}${op?.product?.image}`}
                            onClick={() => {
                              handleViewProduct(row.id);
                            }}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Box>
                  <Box sx={{ width: 200, textAlign: 'right' }}>{item?.status}</Box>
                  <Box sx={{ width: 340, textAlign: 'right' }}>
                    {fCurrency(
                      calculateAfterTax(
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        item?.totalOrderAmount -
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          item?.totalOrderAmount * (item?.discount / 100),
                        item?.snapshotTaxPercentage
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
              handleViewCustomer(row.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>

          <PermissionAccessController permission={PermissionsType.EDIT_CUSTOMER}>
            <MenuItem
              onClick={() => {
                onEditRow();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
          </PermissionAccessController>
          <PermissionAccessController permission={PermissionsType.DELETE_CUSTOMER}>
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
export default CustomersTableRow;
