import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import useRoutesFilter from 'src/hooks/use-routes-filter';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext, usePermissionsContext } from 'src/auth/hooks';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));

export function Router() {
  const { permissions } = usePermissionsContext();
  const { user } = useAuthContext();

  const dashboardRoutesFiltered = useRoutesFilter(dashboardRoutes, permissions, user?.roles[0]);

  return useRoutes([
    {
      path: '/',
      /**
       * Skip home page
       * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
       */
      element: (
        <Suspense fallback={<SplashScreen />}>
          <MainLayout>
            <HomePage />
          </MainLayout>
        </Suspense>
      ),
    },

    // Auth
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutesFiltered,

    // Main
    ...mainRoutes,

    // Components
    ...componentsRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
