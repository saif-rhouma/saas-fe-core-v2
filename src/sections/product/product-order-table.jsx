import { useCallback } from 'react';

import { Box, Table, TableRow, TableBody, TableCell } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { TableHeadCustom } from 'src/components/table';

const ProductOrderTable = ({ productOrders }) => {
  const TABLE_HEAD = [
    { id: 'name', label: 'Order Ref', width: 150 },
    { id: 'quantity', label: 'Customer' },
    { id: 'quantity', label: 'Quantity', width: 200 },
    { id: 'quantity', label: 'Price', width: 200 },
    { id: 'quantity', label: 'Total Order Amount', width: 200 },
  ];

  const router = useRouter();
  const handleViewOrder = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
    >
      <Table size="medium">
        <TableHeadCustom headLabel={TABLE_HEAD} />

        <TableBody>
          {productOrders?.map((item) => (
            <TableRow key={item?.id}>
              <TableCell>
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
              </TableCell>
              <TableCell> {item?.order?.customer.name} </TableCell>
              <TableCell> x{item?.quantity} </TableCell>
              <TableCell> {fCurrency(item?.snapshotProductPrice)} </TableCell>
              <TableCell>{fCurrency(item?.order?.totalOrderAmount)} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
export default ProductOrderTable;
