// client/src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminSidebar() {
    return (
        <div className="list-group">
            <NavLink 
                to="/admin/users" 
                className="list-group-item list-group-item-action"
            >
                <i className="fas fa-users me-2"></i> User Management
            </NavLink>
            <NavLink 
                to="/admin/products" 
                className="list-group-item list-group-item-action"
            >
                <i className="fas fa-box-open me-2"></i> Product Management
            </NavLink>
            <NavLink 
                to="/admin/orders" 
                className="list-group-item list-group-item-action"
            >
                <i className="fas fa-shopping-basket me-2"></i> Order Management
            </NavLink>
        </div>
    );
}

export default AdminSidebar;