import { useContext } from 'react';

import { PermissionContext } from '../context/permission-context';

// ----------------------------------------------------------------------

export function usePermissionsContext() {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error('usePermissionsContext: Context must be used inside PermissionsProvider');
  }

  return context;
}
