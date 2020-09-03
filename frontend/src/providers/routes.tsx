import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom'

const LoginLazy = lazy(() => import('pages/Login'))
const SignupLazy = lazy(() => import('pages/Signup'))

const HomeLazy = lazy(() => import('pages/Home'))
const Home1Lazy = lazy(() => import('pages/Home/Home1'))
const Home2Lazy = lazy(() => import('pages/Home/Home2'))

type PartialRouteObject = ArgumentTypes<typeof useRoutes>[0][9001]
const routes: PartialRouteObject[] = [
  {
    path: '/login',
    element: <LoginLazy />
  },
  {
    path: '/signup',
    element: <SignupLazy />
  },
  {
    path: '/',
    element: <HomeLazy />,
    children: [
      {
        path: 'home1',
        element: <Home1Lazy />,
      },
      {
        path: 'home2',
        element: <Home2Lazy />,
      },
    ],
  },
]
export default routes