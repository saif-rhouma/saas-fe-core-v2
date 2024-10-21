import { Box, Table, Button, TableRow, TableBody, TableCell } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { TableHeadCustom } from 'src/components/table';

import { IncrementerButton } from '../product/components/incrementer-button';

const PlanProductTable = ({ products, quantity, onDecrease, onIncrease, removeItem }) => {
  const TABLE_HEAD = [
    { id: 'planId', label: '#', width: 40, align: 'center' },
    { id: 'name', label: 'Product Name' },
    { id: 'quantity', label: 'Qty', width: 200 },
  ];

  if (products?.length) {
    TABLE_HEAD.push({ id: 'action', width: 10 });
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
          {products.length ? (
            products?.map((product, idx) => (
              <TableRow key={product?.id}>
                <TableCell align="center"> {idx + 1 || product?.id} </TableCell>
                <TableCell> {product?.name} </TableCell>
                <TableCell>
                  <Box sx={{ width: 88, textAlign: 'right' }}>
                    <IncrementerButton
                      quantity={product.quantity}
                      onDecrease={() => onDecrease(idx)}
                      onIncrease={() => onIncrease(idx)}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Button sx={{ color: 'error.main' }} onClick={removeItem}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell align="center"> {products?.id} </TableCell>
              <TableCell> {products?.name} </TableCell>
              <TableCell>{quantity}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
export default PlanProductTable;
