import { useMemo } from 'react';

import { RoleType, PermissionsType } from 'src/utils/constant';

const useRoutesFilter = (routesData, permissions, role) => {
  const hasPermission = (requiredPermission) => permissions.includes(requiredPermission);
  const hasPermissions = (requiredPermissions) =>
    requiredPermissions.some((perm) => permissions.includes(perm));
  const filteredRoutesData = useMemo(
    () =>
      routesData.map((section) => ({
        ...section,
        children: section.children.filter((item) => {
          // Remove items based on permissions
          if (
            item?.path === 'order' &&
            !hasPermissions([
              PermissionsType.LIST_ORDER,
              PermissionsType.ADD_ORDER,
              PermissionsType.VIEW_ORDER,
            ])
          )
            return false;
          if (
            item.path === 'product' &&
            !hasPermissions([
              PermissionsType.LIST_PRODUCT,
              PermissionsType.LIST_ADDON,
              PermissionsType.PRODUCT_STOCK,
              PermissionsType.ADD_PRODUCT,
              PermissionsType.ADD_ADDON,
              PermissionsType.EDIT_PRODUCT,
              PermissionsType.EDIT_ADDON,
              PermissionsType.DELETE_PRODUCT,
              PermissionsType.DELETE_ADDON,
            ])
          )
            return false;
          if (item.path === 'order-status' && !hasPermission(PermissionsType.ORDER_STATUS_SCREEN))
            return false;
          if (
            item.path === 'plan' &&
            !hasPermissions([
              PermissionsType.LIST_PLAN,
              PermissionsType.VIEW_PLAN,
              PermissionsType.ADD_PLAN,
              PermissionsType.EDIT_PLAN,
              PermissionsType.DELETE_PLAN,
            ])
          )
            return false;
          if (item.path === 'plan-status' && !hasPermission(PermissionsType.PLAN_STATUS_SCREEN))
            return false;
          if (
            item.path === 'customer' &&
            !hasPermissions([
              PermissionsType.LIST_CUSTOMER,
              PermissionsType.ADD_CUSTOMER,
              PermissionsType.EDIT_CUSTOMER,
              PermissionsType.DELETE_CUSTOMER,
            ])
          )
            return false;
          if (
            item.path === 'payments' &&
            !hasPermissions([
              PermissionsType.PAYMENT_LIST,
              PermissionsType.ADD_PAYMENT,
              PermissionsType.EDIT_PAYMENT,
              PermissionsType.DELETE_PAYMENT,
            ])
          )
            return false;
          if (
            item.path === 'reminders' &&
            !hasPermissions([
              PermissionsType.REMINDER_LIST,
              PermissionsType.ADD_REMINDER,
              PermissionsType.EDIT_REMINDER,
              PermissionsType.DELETE_REMINDER,
            ])
          )
            return false;
          if (
            item.path === 'tickets' &&
            !hasPermissions([
              PermissionsType.TICKET_LIST,
              PermissionsType.ADD_TICKET,
              PermissionsType.EDIT_TICKET,
              PermissionsType.DELETE_TICKET,
            ])
          )
            return false;
          if (
            item.path === 'staff' &&
            !hasPermissions([
              PermissionsType.STAFF_LIST,
              PermissionsType.ADD_STAFF,
              PermissionsType.EDIT_STAFF,
              PermissionsType.DELETE_STAFF,
            ])
          )
            return false;
          if (
            item.path === 'reports' &&
            !hasPermissions([
              PermissionsType.PLAN_REPORT,
              PermissionsType.DAILY_REPORT,
              PermissionsType.ORDER_REPORT,
              PermissionsType.STOCK_REPORT,
            ])
          )
            return false;
          if (
            item.path === 'tools' &&
            !hasPermissions([
              PermissionsType.ACCOUNT_SETTINGS,
              PermissionsType.MASTER_SETTINGS,
              PermissionsType.FINANCIAL_LIST,
            ])
          )
            return false;

          // Handle children items within a parent (e.g., Products, Reports)
          if (item.children) {
            item.children = item.children.filter((childItem) => {
              // Order Path
              if (
                item.path === 'order' &&
                childItem.path === 'list' &&
                !hasPermission(PermissionsType.LIST_ORDER)
              )
                return false;
              if (
                item.path === 'order' &&
                childItem.path === ':id' &&
                !hasPermission(PermissionsType.VIEW_ORDER)
              )
                return false;
              if (
                item.path === 'order' &&
                childItem.path === 'new' &&
                !hasPermission(PermissionsType.ADD_ORDER)
              )
                return false;

              // Product Path
              if (
                item.path === 'product' &&
                childItem.path === 'list' &&
                !hasPermission(PermissionsType.LIST_PRODUCT)
              )
                return false;
              if (
                item.path === 'product' &&
                childItem.path === 'addons' &&
                !hasPermission(PermissionsType.LIST_ADDON)
              )
                return false;
              if (
                item.path === 'product' &&
                childItem.path === 'new' &&
                !hasPermission(PermissionsType.ADD_PRODUCT)
              )
                return false;

              if (
                item.path === 'product' &&
                childItem.path === ':id/edit' &&
                !hasPermission(PermissionsType.EDIT_PRODUCT)
              )
                return false;

              if (
                item.path === 'product' &&
                childItem.path === 'stock' &&
                !hasPermission(PermissionsType.PRODUCT_STOCK)
              )
                return false;

              // Plan Path
              if (
                item.path === 'plan' &&
                childItem.path === 'list' &&
                !hasPermission(PermissionsType.LIST_PLAN)
              )
                return false;
              if (
                item.path === 'plan' &&
                childItem.path === ':id' &&
                !hasPermission(PermissionsType.VIEW_PLAN)
              )
                return false;
              if (
                item.path === 'plan' &&
                childItem.path === 'new' &&
                !hasPermission(PermissionsType.ADD_PLAN)
              )
                return false;

              if (
                item.path === 'plan' &&
                childItem.path === ':id/edit' &&
                !hasPermission(PermissionsType.EDIT_PLAN)
              )
                return false;

              // Customer Path
              if (
                item.path === 'customer' &&
                childItem.path === 'list' &&
                !hasPermission(PermissionsType.LIST_CUSTOMER)
              )
                return false;

              // Payments Path
              if (
                item.path === 'payments' &&
                childItem.path === 'list' &&
                !hasPermission(PermissionsType.PAYMENT_LIST)
              )
                return false;

              // Peminders Path
              if (
                item.path === 'reminders' &&
                childItem.path === 'list' &&
                !hasPermission(PermissionsType.REMINDER_LIST)
              )
                return false;

              // Tickets Path
              if (
                item.path === 'tickets' &&
                childItem.path === 'list' &&
                !hasPermission(PermissionsType.TICKET_LIST)
              )
                return false;
              if (
                item.path === 'tickets' &&
                childItem.path === ':id' &&
                !hasPermission(PermissionsType.TICKET_LIST)
              )
                return false;

              // Staff Path
              if (
                item.path === 'staff' &&
                childItem.path === 'list' &&
                !hasPermission(PermissionsType.STAFF_LIST)
              )
                return false;
              if (
                item.path === 'staff' &&
                childItem.path === 'new' &&
                !hasPermission(PermissionsType.ADD_STAFF)
              )
                return false;

              if (
                item.path === 'staff' &&
                childItem.path === ':id/edit' &&
                !hasPermission(PermissionsType.EDIT_STAFF)
              )
                return false;

              // Reports Path
              if (
                item.path === 'reports' &&
                childItem.path === 'daily' &&
                !hasPermission(PermissionsType.DAILY_REPORT)
              )
                return false;
              if (
                item.path === 'reports' &&
                childItem.path === 'order' &&
                !hasPermission(PermissionsType.ORDER_REPORT)
              )
                return false;
              if (
                item.path === 'reports' &&
                childItem.path === 'plan' &&
                !hasPermission(PermissionsType.PLAN_REPORT)
              )
                return false;
              if (
                item.path === 'reports' &&
                childItem.path === 'stock' &&
                !hasPermission(PermissionsType.STOCK_REPORT)
              )
                return false;

              // Tools Path
              if (
                item.path === 'tools' &&
                childItem.path === 'account-setting' &&
                !hasPermission(PermissionsType.ACCOUNT_SETTINGS)
              )
                return false;
              if (
                item.path === 'tools' &&
                childItem.path === 'financial-year' &&
                !hasPermission(PermissionsType.FINANCIAL_LIST)
              )
                return false;

              if (
                item.path === 'tools' &&
                childItem.path === 'master-setting' &&
                !hasPermission(PermissionsType.MASTER_SETTINGS)
              )
                return false;

              return true;
            });
          }

          return true; // Keep the item if no conditions remove it
        }),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routesData, permissions, role]
  );

  if (role !== RoleType.STAFF) {
    return routesData;
  }

  return filteredRoutesData;
};

export default useRoutesFilter;
