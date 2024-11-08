import { useState, useEffect, useCallback } from 'react';

import { RoleType } from 'src/utils/constant';

import { useAuthContext, usePermissionsContext } from 'src/auth/hooks';

export function usePermissionAccessController(permission) {
  const { user } = useAuthContext();
  const { permissions } = usePermissionsContext();
  const [hasPermission, setHasPermission] = useState(false);
  const permissionChecker = useCallback((per) => permissions.includes(per), [permissions]);
  useEffect(() => {
    if (user.roles[0] === RoleType.STAFF) {
      setHasPermission(permissionChecker(permission));
    } else {
      setHasPermission(true);
    }
  }, [permission, permissionChecker, user.roles]);
  return hasPermission;
}
