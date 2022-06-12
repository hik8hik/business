import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const AuthForgotpassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/Forgotpassword3')));
const AuthResetpassword = Loadable(lazy(() => import('views/pages/authentication/authentication3/Resetpassword3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <AuthLogin3 />
        },
        {
            path: '/register',
            element: <AuthRegister3 />
        },
        {
            path: '/forgotpassword',
            element: <AuthForgotpassword />
        },
        {
            path: '/passwordreset/:resetToken',
            element: <AuthResetpassword />
        }
    ]
};

export default AuthenticationRoutes;
