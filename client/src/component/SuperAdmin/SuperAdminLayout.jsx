// client/src/component/SuperAdmin/SuperAdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';

function SuperAdminLayout() {
    return (
        <div className="admin-page-container">
            <SuperAdminSidebar />
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
}

export default SuperAdminLayout;







