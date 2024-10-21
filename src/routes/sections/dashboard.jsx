import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
const OrderCreatePage = lazy(() => import('src/pages/dashboard/order/new'));
// Plan
const PlanListPage = lazy(() => import('src/pages/dashboard/plan/list'));
const PlanDetailsPage = lazy(() => import('src/pages/dashboard/plan/details'));
const PlanCreatePage = lazy(() => import('src/pages/dashboard/plan/new'));
const PlanEditPage = lazy(() => import('src/pages/dashboard/plan/edit'));
// Product
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
const ProductAddonsPage = lazy(() => import('src/pages/dashboard/product/addons'));
const ProductStockPage = lazy(() => import('src/pages/dashboard/product/stock'));
const ProductCategoryPage = lazy(() => import('src/pages/dashboard/product/category'));
const ProductCategoryDetailsPage = lazy(
  () => import('src/pages/dashboard/product/category-details')
);
// Customer
const CustomerListPage = lazy(() => import('src/pages/dashboard/customers/list'));
const CustomerDetailsPage = lazy(() => import('src/pages/dashboard/customers/details'));
// Payments
const PaymentsListPage = lazy(() => import('src/pages/dashboard/payments/list'));
// Reminders
const RemindersListPage = lazy(() => import('src/pages/dashboard/reminders/list'));
// Tickets
const TicketsListPage = lazy(() => import('src/pages/dashboard/tickets/list'));
const TicketsDetailsPage = lazy(() => import('src/pages/dashboard/tickets/details'));
// Staff
const StaffListPage = lazy(() => import('src/pages/dashboard/staff/list'));
const StaffCreatePage = lazy(() => import('src/pages/dashboard/staff/new'));
const StaffEditPage = lazy(() => import('src/pages/dashboard/staff/edit'));
// Reports;
const ReportsDailyListPage = lazy(() => import('src/pages/dashboard/reports/daily-list'));
const ReportsOrderListPage = lazy(() => import('src/pages/dashboard/reports/order-list'));
const ReportsPlanListPage = lazy(() => import('src/pages/dashboard/reports/plan-list'));
const ReportsStockListPage = lazy(() => import('src/pages/dashboard/reports/stock-list'));
// const ReportsCustomListPage = lazy(() => import('src/pages/dashboard/reports/custom-list'));
// Tools
const ToolsAccountPage = lazy(() => import('src/pages/dashboard/tools/list'));
// const ToolsFinancialPage = lazy(() => import('src/pages/dashboard/tools/financial'));
const ToolsMasterPage = lazy(() => import('src/pages/dashboard/tools/master'));
const PermissionsGroupPage = lazy(() => import('src/pages/dashboard/tools/permissions-group'));
const PermissionsGroupCreatePage = lazy(
  () => import('src/pages/dashboard/tools/new-permission-group')
);
const PermissionsGroupEditPage = lazy(
  () => import('src/pages/dashboard/tools/edit-permission-group')
);
const PermissionsGroupDetailsPage = lazy(
  () => import('src/pages/dashboard/tools/permission-group-details')
);
// Order Status
const OrderStatus = lazy(() => import('src/pages/dashboard/order/status'));
// Plan Status
const PlanStatus = lazy(() => import('src/pages/dashboard/plan/status'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
          { path: 'new', element: <OrderCreatePage /> },
        ],
      },
      { path: 'order-status', element: <OrderStatus /> },
      { path: 'plan-status', element: <PlanStatus /> },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'categories', element: <ProductCategoryPage /> },
          { path: 'categories/details/:id', element: <ProductCategoryDetailsPage /> },
          { path: 'stock', element: <ProductStockPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
          // { path: 'addons', element: <ProductAddonsPage /> },
        ],
      },
      {
        path: 'plan',
        children: [
          { element: <PlanListPage />, index: true },
          { path: 'list', element: <PlanListPage /> },
          { path: ':id', element: <PlanDetailsPage /> },
          { path: 'new', element: <PlanCreatePage /> },
          { path: ':id/edit', element: <PlanEditPage /> },
        ],
      },
      {
        path: 'customer',
        children: [
          { element: <CustomerListPage />, index: true },
          { path: 'list', element: <CustomerListPage /> },
          { path: ':id', element: <CustomerDetailsPage /> },
        ],
      },
      {
        path: 'payments',
        children: [
          { element: <PaymentsListPage />, index: true },
          { path: 'list', element: <PaymentsListPage /> },
        ],
      },
      {
        path: 'reminders',
        children: [
          { element: <RemindersListPage />, index: true },
          { path: 'list', element: <RemindersListPage /> },
        ],
      },
      {
        path: 'tickets',
        children: [
          { element: <TicketsListPage />, index: true },
          { path: 'list', element: <TicketsListPage /> },
          { path: ':id', element: <TicketsDetailsPage /> },
        ],
      },
      {
        path: 'staff',
        children: [
          { element: <StaffListPage />, index: true },
          { path: 'list', element: <StaffListPage /> },
          { path: 'new', element: <StaffCreatePage /> },
          { path: ':id/edit', element: <StaffEditPage /> },
        ],
      },
      {
        path: 'reports',
        children: [
          { element: <ReportsDailyListPage />, index: true },
          { path: 'daily', element: <ReportsDailyListPage /> },
          { path: 'order', element: <ReportsOrderListPage /> },
          { path: 'plan', element: <ReportsPlanListPage /> },
          { path: 'stock', element: <ReportsStockListPage /> },
        ],
      },
      {
        path: 'tools',
        children: [
          { element: <ToolsMasterPage />, index: true },
          { path: 'account-setting', element: <ToolsAccountPage /> },
          // { path: 'financial-year', element: <ToolsFinancialPage /> },
          { path: 'master-setting', element: <ToolsMasterPage /> },
          { path: 'permissions-groups', element: <PermissionsGroupPage /> },
          { path: 'permissions-groups/new', element: <PermissionsGroupCreatePage /> },
          { path: 'permissions-groups/:id', element: <PermissionsGroupDetailsPage /> },
          { path: 'permissions-groups/:id/edit', element: <PermissionsGroupEditPage /> },
        ],
      },
    ],
  },
];
