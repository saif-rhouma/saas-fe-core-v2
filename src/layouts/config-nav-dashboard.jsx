import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  reports: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    // subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Orders', path: paths.dashboard.order.root, icon: ICONS.order },
      {
        title: 'Products',
        path: paths.dashboard.product.root,
        icon: ICONS.product,
        children: [
          { title: 'Products List', path: paths.dashboard.product.root },
          // { title: 'Products Addons', path: paths.dashboard.product.addons },
          { title: 'Categories List', path: paths.dashboard.product.categories },
          { title: 'Product Stock', path: paths.dashboard.product.stock },
        ],
      },
      { title: 'Orders Status', path: paths.dashboard.order.status, icon: ICONS.menuItem },
      { title: 'Plans', path: paths.dashboard.plan.root, icon: ICONS.booking },
      { title: 'Plans Status', path: paths.dashboard.plan.status, icon: ICONS.menuItem },
      { title: 'Customers', path: paths.dashboard.customers.root, icon: ICONS.label },
      { title: 'Payments', path: paths.dashboard.payments.root, icon: ICONS.invoice },
      { title: 'Reminders', path: paths.dashboard.reminders.root, icon: ICONS.calendar },
      { title: 'Tickets', path: paths.dashboard.tickets.root, icon: ICONS.job },
      { title: 'Users', path: paths.dashboard.staff.root, icon: ICONS.user },
      {
        title: 'Reports',
        path: paths.dashboard.reports.root,
        icon: ICONS.reports,
        children: [
          { title: 'Daily Report', path: paths.dashboard.reports.daily },
          { title: 'Order Report', path: paths.dashboard.reports.order },
          { title: 'Plan Report', path: paths.dashboard.reports.plan },
          { title: 'Stock Report', path: paths.dashboard.reports.stock },
        ],
      },
      {
        title: 'Settings',
        path: paths.dashboard.tools.root,
        icon: ICONS.course,
        children: [
          { title: 'Permission Groups', path: paths.dashboard.tools.permissions },
          // { title: 'Financial Year', path: paths.dashboard.tools.financial },
          { title: 'Master Setting', path: paths.dashboard.tools.master },
        ],
      },
      // { title: 'Logout', path: paths.dashboard.general.course, icon: ICONS.disabled },
    ],
  },
];

export const navDataInit = [
  /**
   * Overview
   */
  {
    // subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      // { title: 'Logout', path: paths.dashboard.general.course, icon: ICONS.disabled },
    ],
  },
];
