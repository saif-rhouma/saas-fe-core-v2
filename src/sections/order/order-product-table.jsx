import { Box, Table, Button, TableRow, TableBody, TableCell } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { TableHeadCustom } from 'src/components/table';

import { IncrementerButton } from '../product/components/incrementer-button';

const OrderProductTable = ({
  products,
  isDetail,
  onDecrease,
  onIncrease,
  onDecreaseDiscount,
  onIncreaseDiscount,
  handleDiscountDialog,
  removeItem,
}) => {
  const TABLE_HEAD = [
    { id: 'orderNumber', label: '#', width: 40, align: 'center' },
    { id: 'name', label: 'Product Name', width: 400 },
    { id: 'rate', label: 'Rate', width: 200 },
    { id: 'totalAmount', label: 'Quantity' },
    { id: 'status', label: 'Total' },
  ];

  if (!isDetail) {
    TABLE_HEAD.push({ id: 'action', width: 5 });
  }

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
          {products?.map((product, idx) => (
            <TableRow key={isDetail ? `${product.productId}` : `${product.id}`}>
              <TableCell align="center"> {idx + 1 || product.productId} </TableCell>
              <TableCell> {isDetail ? `${product.product.name}` : product.name} </TableCell>
              <TableCell align={isDetail ? 'inherit' : 'center'}>
                {isDetail ? (
                  `${fCurrency(product.snapshotProductPrice || product.product.price)}`
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      p: 0.5,
                      borderRadius: 1,
                      typography: 'subtitle2',
                      border: (theme) =>
                        `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
                    }}
                  >
                    <Box>{fCurrency(product.price)}</Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 0,
                        padding: 0.5,
                        color: 'warning.main',
                        '&:hover': { color: 'error.main' },
                      }}
                      onClick={() => handleDiscountDialog({ index: idx, product }, product.price)}
                    >
                      <Iconify icon="solar:pen-bold" />
                    </Box>
                  </Box>
                )}
              </TableCell>
              {/* <TableCell>{isDetail && `x${product.quantity}`}</TableCell> */}
              {/* <TableCell align={isDetail ? 'inherit' : 'center'}>
                {isDetail && `${fCurrency(product.product.price)}`}
              </TableCell>
              `x${product.quantity} (${fCurrency(product.snapshotProductPrice)})`
              */}
              <TableCell>
                {isDetail ? (
                  <Box sx={{ width: 240, color: 'error.main', fontWeight: 'bold' }}>
                    x{product?.quantity}
                  </Box>
                ) : (
                  <Box sx={{ width: 88, textAlign: 'right' }}>
                    <IncrementerButton
                      quantity={product.quantity}
                      onDecrease={() => onDecrease(idx)}
                      onIncrease={() => onIncrease(idx)}
                    />
                  </Box>
                )}
              </TableCell>
              <TableCell>
                {isDetail
                  ? `${fCurrency(product.snapshotProductPrice * product.quantity)}`
                  : fCurrency(
                      (product.price - product.price * (product.discount / 100)) * product.quantity
                    )}
              </TableCell>
              {!isDetail && (
                <TableCell>
                  <Button
                    sx={{ color: 'error.main' }}
                    onClick={() => {
                      removeItem(idx);
                    }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
export default OrderProductTable;
