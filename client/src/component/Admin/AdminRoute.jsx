// client/src/components/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const AdminRoute = () => {
    const { isAuthenticated, user } = useContext(AppContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user?.isAdmin || user?.role === 'Admin';
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;