// client/src/component/UserRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const UserRoute = () => {
    const { isAuthenticated, user } = useContext(AppContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Prevent admin and super admin from accessing user routes
    const isAdmin = user?.isAdmin || user?.role === 'Admin';
    const isSuperAdmin = user?.role === 'Super Admin';
    
    if (isSuperAdmin) {
        return <Navigate to="/superadmin/dashboard" replace />;
    }
    
    if (isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

export default UserRoute;

