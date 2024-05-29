import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Dashboard } from './pages/app/dashboard'
import { SignIn } from './pages/auth/signIn'

interface AppRouteType {
  path: string
  page: React.ReactNode
}

const appRoutes: AppRouteType[] = [
  {
    path: '/',
    page: <Dashboard />,
  },
  {
    path: '/sign-in',
    page: <SignIn />,
  },
]

export function AppRouter() {
  return (
    <Routes>
      {appRoutes.map((route) => {
        return <Route key={route.path} path={route.path} element={route.page} />
      })}
    </Routes>
  )
}
