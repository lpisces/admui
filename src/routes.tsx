import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import Login from './pages/Login/index';
import Register from './pages/Register/index';
import ForgotPassword from './pages/ForgotPassword/index';
import Welcome from './pages/Welcome/index';
import Organization from './pages/Organization/index';
import User from './pages/User/index';
import Permission from './pages/Permission/index';
import File from './pages/File/index';
import Settings from './pages/Settings/index';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/dashboard',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard/welcome" />,
      },
      {
        path: 'welcome',
        element: <Welcome />,
      },
      {
        path: 'organization',
        element: <Organization />,
      },
      {
        path: 'user',
        element: <User />,
      },
      {
        path: 'permission',
        element: <Permission />,
      },
      {
        path: 'file',
        element: <File />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" />,
  },
];

export default routes; 