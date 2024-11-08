/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */
import dayjs from 'dayjs';
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputAdornment,
  FormHelperText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { fCurrency } from 'src/utils/format-number';
import { calculateTax, calculateAfterTax } from 'src/utils/helper';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';

import { toast } from 'src/components/snackbar';
import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import InfoDialog from 'src/components/dialogs/info-dialog';
import ProductItemButton from 'src/components/product/product-Item-button';
import { ComponentPaginationCustom } from 'src/components/table/component-pagination-custom';

import OrderProductTable from '../order/order-product-table';
import OrderDiscountDialog from '../order/order-discount-dialog';
import OrderCustomerCreateDialog from '../order/order-customer-create-dialog';
import OrderDiscountProductDialog from '../order/order-discount-product-dialog';

export function QuotationEditForm({ quotation, products, customers, taxPercentage }) {
  const table = useTable({ defaultRowsPerPage: 6 });

  const dialog = useBoolean();
  const dialogDiscount = useBoolean();
  const dialogDiscountProduct = useBoolean();
  const dialogInfo = useBoolean();
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContentText, setDialogContentText] = useState('');
  const router = useRouter();
  const [orderId, setOrderId] = useState(quotation?.name);
  const [discount, setDiscount] = useState(quotation?.discount);
  const [discountProduct, setDiscountProduct] = useState(0);
  const [customerError, setCustomerError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState(quotation?.customer?.id);
  const [selectedDate, setSelectedDate] = useState(dayjs(quotation?.quotationDate));
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filterProducts, setfilterProducts] = useState(products);

  useEffect(() => {
    const productQty = [];

    for (const prQuo of quotation?.productToQuotation) {
      const item = {
        ...prQuo.product,
        quantity: prQuo.quantity,
        discount: prQuo.discount || 0,
        price: prQuo?.snapshotProductPrice,
        snapshotProductPrice: prQuo?.price,
      };
      productQty.push(item);
    }
    setSelectedProducts(productQty);
  }, [quotation]);

  const queryClient = useQueryClient();

  const handleDiscountDialog = (payload, amount) => {
    setDiscountProduct(amount);
    setSelectedProduct(payload);
    dialogDiscountProduct.onToggle();
  };

  const handleDiscount = (amount) => {
    setDiscount(amount);
    dialogDiscount.onFalse();
  };

  const handleDiscountProduct = (index, amount) => {
    setSelectedProducts((prev) => {
      prev[index].price = amount;
      return [...prev];
    });
    dialogDiscountProduct.onFalse();
  };

  const { mutate: editQuotation } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.quotation.edit + id, payload),
    onSuccess: async () => {
      toast.success('New Quotation Has Been Created!');
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
    onSettled: async () => {
      router.push(paths.dashboard.quotation.root);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleOrderId = useCallback((event) => {
    setOrderId(event.target.value);
  }, []);

  const handleChangeCustomer = useCallback((event) => {
    setSelectedCustomer(event.target.value);
    if (event.target.value === 'Customer') {
      setCustomerError(true);
    } else {
      setCustomerError(false);
    }
  }, []);
  const handleAddProducts = useCallback((payload) => {
    setSelectedProducts((prev) => {
      const isFoundIndx = prev.findIndex((prod) => prod.id === payload.id);
      if (isFoundIndx >= 0) {
        prev[isFoundIndx].quantity += 1;
      } else {
        payload.quantity = 1;
        payload.discount = 0;
        prev.push(payload);
      }
      return [...prev];
    });
  }, []);
  const handleFilterProducts = useCallback((event) => {
    const name = event.target.value;
    if (name) {
      setfilterProducts(
        products.filter((product) => product.name.toLowerCase().indexOf(name) !== -1)
      );
    }
    if (name === undefined || name === null || name === '') {
      setfilterProducts(products);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnDecrease = useCallback(
    (idx) => {
      setSelectedProducts((prev) => {
        prev[idx].quantity -= 1;
        if (prev[idx].quantity === 0) {
          prev.splice(idx, 1);
        }
        return [...prev];
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProducts]
  );

  const handleOnDecreaseDiscount = useCallback((idx) => {
    setSelectedProducts((prev) => {
      if (prev[idx].discount > 0) {
        prev[idx].discount -= 1;
      }
      return [...prev];
    });
  }, []);

  const handleOnIncreaseDiscount = useCallback((idx) => {
    setSelectedProducts((prev) => {
      if (prev[idx].discount < 100) {
        prev[idx].discount += 1;
      }
      return [...prev];
    });
  }, []);

  const handleOnIncrease = useCallback(
    (idx) => {
      setSelectedProducts((prev) => {
        prev[idx].quantity += 1;
        return [...prev];
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProducts]
  );

  const handleDeleteRow = useCallback(
    (idx) => {
      setSelectedProducts((prev) => {
        prev.splice(idx, 1);
        return [...prev];
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProducts]
  );

  const getTotal = useCallback(
    () => selectedProducts.reduce((total, product) => total + product.price * product.quantity, 0),
    [selectedProducts]
  );

  const getTotalProductDiscount = useCallback(
    () =>
      selectedProducts.reduce(
        (total, product) => total + product.price * (product.discount / 100) * product.quantity,
        0
      ),
    [selectedProducts]
  );

  const { mutate: handleCreateCustomer } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.customers.create, payload),
    onSuccess: async () => {
      toast.success('New Customer Has Been Created!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      dialog.onFalse();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const renderOrderList = (
    <Card>
      <Stack>
        <Box sx={{ p: 3 }}>
          <TextField
            color="success"
            // focused
            fullWidth
            maxWidth="xs"
            placeholder="Search product..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            // sx={{
            //   '& .MuiOutlinedInput-root': {
            //     border: '1px solid #909090',
            //   },
            // }}
            onChange={handleFilterProducts}
          />
        </Box>
        <Box
          sx={{ pl: 3, pr: 3 }}
          gap={1}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
        >
          {filterProducts
            .slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            .map((product) => (
              <ProductItemButton
                payload={product}
                handleClick={handleAddProducts}
                key={product?.id}
                productName={product?.name}
                // eslint-disable-next-line no-unsafe-optional-chaining
                image={CONFIG.site.serverFileHost + product?.image}
              />
            ))}
        </Box>
        <ComponentPaginationCustom
          page={table.page}
          count={filterProducts.length}
          rowsPerPage={6}
          defaultRowsPerPage={6}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Stack>
    </Card>
  );

  const renderTotal = (
    <Stack spacing={2} alignItems="flex-end" sx={{ p: 2, textAlign: 'right', typography: 'body2' }}>
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(getTotal()) || '-'}</Box>
      </Stack>

      {/* <Stack direction="row" alignItems="center">
        <Box sx={{ color: 'text.secondary' }}>Total Product Discount</Box>
        <Box sx={{ width: 160, ...(0 && { color: 'error.main' }) }}>
          <Box>
            <Stack
              sx={{
                color: 'error.main',
                borderRadius: 1,
                typography: 'subtitle2',
              }}
            >
              {fCurrency(getTotalProductDiscount()) || '-'}
            </Stack>
          </Box>
        </Box>
      </Stack> */}

      <Stack direction="row" alignItems="center">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box sx={{ width: 160, ...(0 && { color: 'error.main' }) }}>
          <Box sx={{ pl: 4, mr: -0.5 }}>
            <Stack
              onClick={() => {
                dialogDiscount.onToggle();
              }}
              sx={{
                cursor: 'pointer',
                p: 0.5,
                color: 'error.main',
                borderRadius: 1,
                typography: 'subtitle2',
                border: (theme) =>
                  `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
              }}
            >
              {discount}%
            </Stack>
          </Box>
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Tax ({taxPercentage || '0'}%)</Box>
        <Box sx={{ width: 160 }}>
          {taxPercentage
            ? fCurrency(calculateTax(getTotal() - getTotal() * (discount / 100), taxPercentage))
            : '-'}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <div>Gross Total:</div>
        <Box sx={{ width: 160 }}>
          {fCurrency(
            calculateAfterTax(getTotal() - getTotal() * (discount / 100), taxPercentage)
          ) || '-'}
        </Box>
      </Stack>
    </Stack>
  );

  const renderOrderCreation = (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }} error={customerError && !selectedCustomer}>
            <Select
              sx={{ maxWidth: 420, textTransform: 'capitalize' }}
              value={selectedCustomer}
              error={customerError}
              onChange={handleChangeCustomer}
            >
              <MenuItem value="Customer">Customer</MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>
            {customerError && <FormHelperText error>Customer is required!</FormHelperText>}
          </FormControl>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => dialog.onToggle()}
            >
              Add Customer
            </Button>
          </Box>

          <TextField
            label="Quotation Title"
            placeholder="This Could Be Generated Automatically"
            value={orderId}
            onChange={handleOrderId}
            sx={{ mt: 2 }}
          />
          <DatePicker
            label="Date"
            // views={['year', 'month', 'day']}
            sx={{ mt: 2 }}
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
          />
        </Box>
        <OrderProductTable
          products={selectedProducts}
          onDecrease={handleOnDecrease}
          onIncrease={handleOnIncrease}
          onDecreaseDiscount={handleOnDecreaseDiscount}
          onIncreaseDiscount={handleOnIncreaseDiscount}
          handleDiscountDialog={handleDiscountDialog}
          removeItem={handleDeleteRow}
        />
        <Box display="flex" flexDirection="column" alignItems="flex-end" justifyContent="center">
          {renderTotal}
          <Box display="flex" gap={2} height={50}>
            <Button
              variant="contained"
              onClick={() => {
                // eslint-disable-next-line no-restricted-globals, radix
                if (isNaN(parseInt(selectedCustomer))) {
                  setCustomerError(true);
                  return;
                }
                setCustomerError(false);

                if (!selectedProducts.length) {
                  setDialogTitle('Something went wrong. Product(s) are required!');
                  setDialogContentText(
                    `You need to add at least one product to this quotation. Please select a product from the list on the right.`
                  );
                  dialogInfo.onToggle();
                  return;
                }

                // eslint-disable-next-line no-restricted-globals, radix
                if (!isNaN(parseInt(selectedCustomer)) && selectedProducts.length) {
                  setCustomerError(false);
                  const payload = {
                    discount: parseInt(discount, 10),
                    name: orderId,
                    quotationDate: selectedDate.format('YYYY-MM-DD'),
                    products: selectedProducts.map((prod) => ({
                      id: prod.id,
                      snapshotProductPrice: prod.price,
                      quantity: prod.quantity,
                    })),
                    customer: selectedCustomer,
                  };
                  editQuotation({ id: quotation.id, payload });
                }
              }}
            >
              Save and Continue
            </Button>
            <Button variant="outlined" onClick={() => setSelectedProducts([])}>
              Clear All
            </Button>
          </Box>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={3}>
        <Stack>{renderOrderList}</Stack>
      </Grid>

      <Grid xs={12} md={9}>
        <Stack>{renderOrderCreation}</Stack>
      </Grid>
      <OrderCustomerCreateDialog
        open={dialog.value}
        onClose={dialog.onFalse}
        handler={handleCreateCustomer}
      />
      <OrderDiscountDialog
        discount={discount}
        open={dialogDiscount.value}
        onClose={dialogDiscount.onFalse}
        handler={handleDiscount}
      />
      <OrderDiscountProductDialog
        product={selectedProduct}
        discount={discountProduct}
        open={dialogDiscountProduct.value}
        onClose={dialogDiscountProduct.onFalse}
        handler={handleDiscountProduct}
      />
      <InfoDialog dialog={dialogInfo} title={dialogTitle} contentText={dialogContentText} />
    </Grid>
  );
}
