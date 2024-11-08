/* eslint-disable no-undef */
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';
import { PermissionsType } from 'src/utils/constant';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import PermissionAccessController from 'src/components/permission-access-controller/permission-access-controller';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { QuotationTableRow } from '../quotation-table-row';
import QuotationDetailCard from '../quotation-detail-card';
import { QuotationTableToolbar } from '../quotation-table-toolbar';
import { QuotationTableFiltersResult } from '../quotation-table-filters-result';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function QuotationListView({ quotations }) {
  const table = useTable({ defaultOrderBy: 'orderId', defaultRowsPerPage: 5 });
  const { t } = useTranslate('quotations');
  const [selectedQuotation, setSelectedQuotation] = useState();
  const [isFullDisplay, setIsFullDisplay] = useState(false);

  const TABLE_HEAD = [
    { id: 'ref', label: '#', width: 88 },
    { id: 'details', label: `${t('listView.table.tableHeader.details')}` },
    { id: 'createdAt', label: `${t('listView.table.tableHeader.date')}`, width: 140 },
    {
      id: 'totalQuantity',
      label: `${t('listView.table.tableHeader.items')}`,
      width: 120,
      align: 'center',
    },
    { id: 'totalAmount', label: `${t('listView.table.tableHeader.price')}`, width: 140 },
    { id: 'createdBy', label: `${t('listView.table.tableHeader.createdBy')}`, width: 200 },
    { id: 'status', label: `${t('listView.table.tableHeader.status')}`, width: 110 },
    { id: '', width: 88 },
  ];

  const [tableHead, settableHead] = useState(TABLE_HEAD);

  const router = useRouter();

  const [tableData, setTableData] = useState(() => quotations);
  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setIsFullDisplay(false);
    setTableData(quotations);
    if (selectedQuotation) {
      const upQuotation = quotations.find((item) => item.id === selectedQuotation.id);
      setSelectedQuotation(upQuotation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotations]);

  useEffect(() => {
    const visibleColumns = selectedQuotation
      ? TABLE_HEAD.filter((column) => !['createdBy', 'status', ''].includes(column.id))
      : TABLE_HEAD;

    settableHead(visibleColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuotation]);

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const queryClient = useQueryClient();

  const { mutate: deleteQuotation } = useMutation({
    mutationFn: (id) => axios.delete(endpoints.quotation.delete + id),
    onSuccess: async () => {
      toast.success('Order Has Been Canceled!');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: () => {},
  });

  const handleDeleteRow = useCallback(
    (id) => {
      deleteQuotation(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataInPage.length, table, tableData]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.replace(paths.dashboard.quotation.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.replace(paths.dashboard.quotation.edit(id));
    },
    [router]
  );

  const handleResize = () => {
    setIsFullDisplay(!isFullDisplay);
  };

  const handleClose = () => {
    setSelectedQuotation(null);
    setIsFullDisplay(false);
  };

  const handleQuotationSelection = (row) => {
    setSelectedQuotation(row);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <CustomBreadcrumbs
            links={[
              { name: `${t('listView.breadCrumbsPageRootTitle')}`, href: paths.dashboard.root },
              {
                name: `${t('listView.breadCrumbsParentPageTitle')}`,
                href: paths.dashboard.quotation.root,
              },
              { name: `${t('listView.breadCrumbsPageTitle')}` },
            ]}
            action={
              <PermissionAccessController permission={PermissionsType.ADD_QUOTATION}>
                <Button
                  component={RouterLink}
                  href={paths.dashboard.quotation.new}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  {`${t('listView.addNewQuotation')}`}
                </Button>
              </PermissionAccessController>
            }
          />
        </Grid>
        <PermissionAccessController permission={PermissionsType.LIST_QUOTATION}>
          {!isFullDisplay && (
            <Grid xs={12} md={selectedQuotation ? 5 : 12}>
              <Card>
                <QuotationTableToolbar
                  filters={filters}
                  onResetPage={table.onResetPage}
                  dateError={dateError}
                />

                {canReset && (
                  <QuotationTableFiltersResult
                    filters={filters}
                    totalResults={dataFiltered.length}
                    onResetPage={table.onResetPage}
                    sx={{ p: 2.5, pt: 0 }}
                  />
                )}

                <Box sx={{ position: 'relative' }}>
                  <TableSelectedAction
                    dense={table.dense}
                    numSelected={table.selected.length}
                    rowCount={dataFiltered.length}
                  />

                  <Scrollbar sx={{ minHeight: 444 }}>
                    <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                      <TableHeadCustom
                        order={table.order}
                        orderBy={table.orderBy}
                        headLabel={tableHead}
                        rowCount={dataFiltered.length}
                      />

                      <TableBody>
                        {dataFiltered
                          .slice(
                            table.page * table.rowsPerPage,
                            table.page * table.rowsPerPage + table.rowsPerPage
                          )
                          .map((row) => (
                            <QuotationTableRow
                              key={row.id}
                              row={row}
                              selected={table.selected.includes(row.id)}
                              onSelectRow={() => table.onSelectRow(row.id)}
                              onDeleteRow={() => handleDeleteRow(row.id)}
                              onViewRow={() => handleViewRow(row.id)}
                              onEditRow={() => handleEditRow(row.id)}
                              onClickRow={() => handleQuotationSelection(row)}
                              isFullDisplay={selectedQuotation}
                            />
                          ))}

                        <TableEmptyRows
                          height={table.dense ? 56 : 56 + 20}
                          emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                        />

                        <TableNoData notFound={notFound} />
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </Box>

                <TablePaginationCustom
                  page={table.page}
                  dense={table.dense}
                  count={dataFiltered.length}
                  rowsPerPage={table.rowsPerPage}
                  onPageChange={table.onChangePage}
                  onChangeDense={table.onChangeDense}
                  onRowsPerPageChange={table.onChangeRowsPerPage}
                />
              </Card>
            </Grid>
          )}

          {selectedQuotation && (
            <Box sx={{ display: 'flex', flex: 1, p: 1.5, transition: 'all 2s ease-in-out' }}>
              <QuotationDetailCard
                selectedQuotation={selectedQuotation}
                handleResize={handleResize}
                handleClose={handleClose}
              />
            </Box>
          )}
        </PermissionAccessController>
      </Grid>
    </DashboardContent>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.id.toString().toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.status.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createTime, startDate, endDate));
    }
  }

  return inputData;
}
