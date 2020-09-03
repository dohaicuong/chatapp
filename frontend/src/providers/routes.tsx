import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom'

const HomeLazy = lazy(() => import('pages/Home'))
const LoginLazy = lazy(() => import('pages/Login'))

type PartialRouteObject = ArgumentTypes<typeof useRoutes>[0][9001]
const routes: PartialRouteObject[] = [
  {
    path: '/',
    element: <HomeLazy />,
  },
  {
    path: '/login',
    element: <LoginLazy />
 },
]
export default routes