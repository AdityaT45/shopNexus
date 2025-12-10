// client/src/component/SuperAdmin/SuperAdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

function SuperAdminRoute() {
    const { user, isAuthenticated } = useContext(AppContext);
    const isSuperAdmin = user?.role === 'Super Admin';

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isSuperAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default SuperAdminRoute;







