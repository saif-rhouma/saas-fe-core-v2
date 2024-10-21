import { useCallback } from 'react';

import { Box, Table, Stack, Avatar, TableRow, TableBody, TableCell } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { TableHeadCustom } from 'src/components/table';

const CustomerProductsTable = ({ products }) => {
  const TABLE_HEAD = [
    { id: 'name', width: 60, label: '#' },
    { id: 'name', label: 'Product' },
    { id: 'quantity', label: 'Quantity', width: 120 },
  ];

  const router = useRouter();

  const handleViewProduct = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
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
          {products?.map((item, idx) => (
            <TableRow key={item?.id}>
              <TableCell> {idx + 1} </TableCell>
              <TableCell>
                <Stack spacing={2} direction="row" alignItems="center">
                  <Avatar
                    alt={item?.name}
                    src={
                      CONFIG.site.serverFileHost +
                      (item?.image || CONFIG.site.defaultImgPlaceHolder)
                    }
                  />
                  <Box
                    component="span"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      handleViewProduct(item.id);
                    }}
                  >
                    {item?.name}
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Box sx={{ width: 240, color: 'error.main', fontWeight: 'bold' }}>
                  x{item?.total_quantity}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
export default CustomerProductsTable;
