import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Welcome from './pages/Welcome';
import Organization from './pages/Organization';
import User from './pages/User';
import Permission from './pages/Permission';
import File from './pages/File';
import Settings from './pages/Settings';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
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
        element: <Navigate to="/dashboard/welcome" replace />,
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
    element: <Navigate to="/login" replace />,
  },
];

export default routes; 