import { useMemo } from 'react';

import { RoleType, PermissionsType } from 'src/utils/constant';

const useNavData = (navData, permissions, role) => {
  // const { t } = useTranslate('navbar');
  const hasPermission = (requiredPermission) => permissions.includes(requiredPermission);
  const hasPermissions = (requiredPermissions) =>
    requiredPermissions.some((perm) => permissions.includes(perm));

  const filteredNavData = useMemo(
    () =>
      navData.map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          // Remove items based on permissions
          if (item.title === `Quotations` && !hasPermission(PermissionsType.LIST_QUOTATION))
            return false;
          if (item.title === `Orders` && !hasPermission(PermissionsType.LIST_ORDER)) return false;
          if (
            item.title === `Products` &&
            !hasPermissions([
              PermissionsType.LIST_PRODUCT,
              PermissionsType.LIST_ADDON,
              PermissionsType.PRODUCT_STOCK,
            ])
          )
            return false;

          if (item.title === `Orders Status` && !hasPermission(PermissionsType.ORDER_STATUS_SCREEN))
            return false;
          if (item.title === `Plans` && !hasPermission(PermissionsType.LIST_PLAN)) return false;
          if (item.title === `Plans Status` && !hasPermission(PermissionsType.PLAN_STATUS_SCREEN))
            return false;
          if (item.title === `Customers` && !hasPermission(PermissionsType.LIST_CUSTOMER))
            return false;
          if (item.title === `Payments` && !hasPermission(PermissionsType.PAYMENT_LIST))
            return false;
          if (item.title === `Reminders` && !hasPermission(PermissionsType.REMINDER_LIST))
            return false;
          if (item.title === `Tickets` && !hasPermission(PermissionsType.TICKET_LIST)) return false;
          if (item.title === `Users` && !hasPermission(PermissionsType.STAFF_LIST)) return false;
          if (
            item.title === `Reports` &&
            !hasPermissions([
              PermissionsType.PLAN_REPORT,
              PermissionsType.DAILY_REPORT,
              PermissionsType.ORDER_REPORT,
              PermissionsType.STOCK_REPORT,
            ])
          )
            return false;
          if (
            item.title === `Settings` &&
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
              if (
                childItem.title === `Products List` &&
                !hasPermission(PermissionsType.LIST_PRODUCT)
              )
                return false;

              if (
                childItem.title === `Categories List` &&
                !hasPermission(PermissionsType.CATEGORY_LIST)
              )
                return false;
              if (
                childItem.title === 'Products Addons' &&
                !hasPermission(PermissionsType.LIST_ADDON)
              )
                return false;
              if (
                childItem.title === `Product Stock` &&
                !hasPermission(PermissionsType.PRODUCT_STOCK)
              )
                return false;
              if (
                childItem.title === `Daily Report` &&
                !hasPermission(PermissionsType.DAILY_REPORT)
              )
                return false;
              if (
                childItem.title === `Order Report` &&
                !hasPermission(PermissionsType.ORDER_REPORT)
              )
                return false;
              if (childItem.title === `Plan Report` && !hasPermission(PermissionsType.PLAN_REPORT))
                return false;
              if (
                childItem.title === `Stock Report` &&
                !hasPermission(PermissionsType.STOCK_REPORT)
              )
                return false;
              if (
                childItem.title === 'Account Settings' &&
                !hasPermission(PermissionsType.ACCOUNT_SETTINGS)
              )
                return false;
              if (
                childItem.title === 'Financial Year' &&
                !hasPermission(PermissionsType.FINANCIAL_LIST)
              )
                return false;
              if (
                childItem.title === 'Master Setting' &&
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
    [navData, permissions]
  );

  if (role !== RoleType.STAFF) {
    return navData;
  }

  return filteredNavData;
};

export default useNavData;
