import { createBrowserRouter } from 'react-router-dom'

import { Constants } from './constants'
import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { Dashboard } from './pages/app/dashboard'
import { SignIn } from './pages/auth/signIn'
import { SignUp } from './pages/auth/signUp'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [{ path: Constants.URLS.DASHBOARD, element: <Dashboard /> }],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: Constants.URLS.SIGN_IN, element: <SignIn /> },
      { path: Constants.URLS.SIGN_UP, element: <SignUp /> },
    ],
  },
])
