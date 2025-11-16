// client/src/pages/AdminUserListScreen.jsx
import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import AdminSidebar from '../../component/Admin/AdminSidebar';

function AdminUserListScreen() {
    const { 
        users, 
        fetchAllUsers, 
        updateUserRole, 
        deleteUser, 
        adminLoading, 
        adminError, 
        isUserAdmin 
    } = useContext(AdminContext);

    useEffect(() => {
        if (isUserAdmin) {
            fetchAllUsers();
        }
        if (adminError) {
            console.error(adminError);
        }
    }, [isUserAdmin, adminError]); // Dependency on adminError for refetch attempts

    const handleRoleChange = (userId, currentRole) => {
        const newRole = !currentRole;
        if (window.confirm(`Are you sure you want to change this user's admin status to ${newRole ? 'Admin' : 'User'}?`)) {
            updateUserRole(userId, newRole);
        }
    };

    const handleDelete = (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete the user: ${userName}? This action is irreversible.`)) {
            deleteUser(userId);
        }
    };

    if (adminLoading && users.length === 0) {
        return <h2 className='text-center mt-5'>Loading Users...</h2>;
    }

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminSidebar />
                </div>
                <div className='col-md-9'>
                    <h1>User Management</h1>
                    {adminError && <div className="alert alert-danger">{adminError}</div>}
                    <table className='table table-striped table-hover mt-3'>
                        <thead>
                            <tr>
                                <th>ID (last 4)</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id.substring(user._id.length - 4)}</td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                    <td>
                                        {user.isAdmin ? (
                                            <i className="fas fa-check text-success"></i>
                                        ) : (
                                            <i className="fas fa-times text-danger"></i>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className='btn btn-sm btn-outline-info me-2'
                                            onClick={() => handleRoleChange(user._id, user.isAdmin)}
                                            disabled={adminLoading}
                                        >
                                            {user.isAdmin ? 'Demote' : 'Promote'}
                                        </button>
                                        <button
                                            className='btn btn-sm btn-outline-danger'
                                            onClick={() => handleDelete(user._id, user.name)}
                                            disabled={adminLoading}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUserListScreen;