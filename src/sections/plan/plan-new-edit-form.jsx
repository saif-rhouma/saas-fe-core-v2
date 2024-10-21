/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
import dayjs from 'dayjs';
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, TextField, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import ProductItemButton from 'src/components/product/product-Item-button';

import PlanProductTable from './plan-product-table';

export function PlanNewEditForm({ products, plan }) {
  const router = useRouter();
  const [planId, setPlanId] = useState();
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState(products);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (plan) {
      plan.product.quantity = plan.quantity;
      setSelectedProducts([plan.product]);
      setPlanId(plan.id);
      setSelectedDate(dayjs(plan.planDate));
    }
  }, [plan]);

  const { mutate: createPlan } = useMutation({
    mutationFn: (payload) => axios.post(endpoints.plan.create, payload),
    onSuccess: async () => {
      toast.success('New Plan Has Been Created!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      router.push(paths.dashboard.plan.root);
    },
    onError: () => {},
  });

  const { mutate: editPlan } = useMutation({
    mutationFn: ({ id, payload }) => axios.patch(endpoints.plan.edit + id, payload),
    onSuccess: async () => {
      toast.success('Plan Has Been Modified!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      router.push(paths.dashboard.plan.root);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handlePlanId = useCallback((event) => {
    setPlanId(event.target.value);
  }, []);

  const handleFilterProducts = useCallback(
    (event) => {
      const name = event.target.value;
      if (name) {
        setFilterProducts(
          products.filter((product) => product.name.toLowerCase().indexOf(name) !== -1)
        );
      }
      if (name === undefined || name === null || name === '') {
        setFilterProducts(products);
      }
    },
    [products]
  );

  const handleAddProducts = useCallback(
    (payload) => {
      setSelectedProducts((prev) => {
        const isFoundIndx = prev.findIndex((prod) => prod.id === payload.id);
        if (isFoundIndx >= 0) {
          prev[isFoundIndx].quantity += 1;
        } else if (prev.length === 0) {
          payload.quantity = 1;
          prev.push(payload);
        }
        return [...prev];
      });
    },
    [selectedProducts]
  );

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
    [selectedProducts]
  );
  const handleOnIncrease = useCallback(
    (idx) => {
      setSelectedProducts((prev) => {
        prev[idx].quantity += 1;
        return [...prev];
      });
    },
    [selectedProducts]
  );

  const handleDeleteRow = useCallback(
    (idx) => {
      setSelectedProducts((prev) => {
        prev.splice(idx, 1);
        return [...prev];
      });
    },
    [selectedProducts]
  );

  const renderOrderList = (
    <Card>
      <Stack spacing={4} sx={{ p: 3 }}>
        <TextField
          fullWidth
          maxWidth="xs"
          placeholder="Search customer or order number..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          onChange={handleFilterProducts}
        />
        <Box
          spacing={2}
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
        >
          {filterProducts.map((product) => (
            <ProductItemButton
              payload={product}
              handleClick={handleAddProducts}
              key={product?.id}
              productName={product?.name}
              image={CONFIG.site.serverFileHost + product?.image}
            />
          ))}
        </Box>
      </Stack>
    </Card>
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
          <TextField label="Plan ID" value={planId} onChange={handlePlanId} sx={{ mt: 2 }} />
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
        <PlanProductTable
          products={selectedProducts}
          onDecrease={handleOnDecrease}
          onIncrease={handleOnIncrease}
          removeItem={handleDeleteRow}
        />
        <Box display="flex" flexDirection="column" alignItems="flex-end" justifyContent="center">
          <Box display="flex" gap={2} height={50}>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedProducts.length) {
                  const payload = {
                    planDate: selectedDate.format('YYYY-MM-DD'),
                    productId: selectedProducts[0].id,
                    quantity: selectedProducts[0].quantity,
                  };
                  if (plan) {
                    editPlan({ id: plan.id, payload });
                  } else {
                    createPlan(payload);
                  }
                }
              }}
            >
              {plan ? 'Save Changes' : 'Save'}
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
      <Grid xs={12} md={4}>
        <Stack>{renderOrderList}</Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack>{renderOrderCreation}</Stack>
      </Grid>
    </Grid>
  );
}
