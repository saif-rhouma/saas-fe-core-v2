import { useMemo, useState, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';
import { PermissionContext } from '../permission-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const [permissions, setPermissions] = useState({
    permissions: [],
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const res = await axios.get(endpoints.auth.me);
        const user = res.data;

        setState({ user: { ...user, accessToken }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  const checkUserPermissions = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken && isValidToken(accessToken)) {
        const res = await axios.get(endpoints.auth.permissions);
        const permissionsList = res.data;

        setPermissions({ permissions: permissionsList, loading: false });
      } else {
        setPermissions({ permissions: [], loading: false });
      }
    } catch (error) {
      console.error(error);
      setPermissions({ permissions: [], loading: false });
    }
  }, [setPermissions]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeFavicon = useCallback((faviconPath) => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = faviconPath;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  useEffect(() => {
    if (state.user?.roles?.includes('STAFF')) {
      checkUserPermissions();
    }
    const favIcon = state.user?.userOwnedApps?.favicon || state.user?.applications?.favicon;
    if (state.user?.userOwnedApps?.favicon || state.user?.applications?.favicon) {
      changeFavicon(`${CONFIG.site.serverFileHost}${favIcon}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkUserPermissions, state]);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      setState,
    }),
    [checkUserSession, state.user, status, setState]
  );

  const memoizedPermissionsValue = useMemo(
    () => ({
      permissions: permissions.permissions,
      loading: permissions.loading,
    }),
    [permissions]
  );

  // if (permissions?.permissions.length > 0) {
  //   return (
  //     <PermissionContext.Provider value={memoizedPermissionsValue}>
  //       <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
  //     </PermissionContext.Provider>
  //   );
  // }
  // return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
  return (
    <PermissionContext.Provider value={memoizedPermissionsValue}>
      <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
    </PermissionContext.Provider>
  );
}
