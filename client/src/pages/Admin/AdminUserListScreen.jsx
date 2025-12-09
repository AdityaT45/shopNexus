// client/src/pages/AdminUserListScreen.jsx
import React, { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

function AdminUserListScreen() {
    const [page, setPage] = useState(1);
    const pageSize = 10;
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
    const newRole = currentRole === "Admin" ? "User" : "Admin";

    if (window.confirm(`Change role to ${newRole}?`)) {
        updateUserRole(userId, newRole);
    }
};

    const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
        deleteUser(userId);
    }
};


    const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
    const pagedUsers = users.slice((page - 1) * pageSize, page * pageSize);

    if (adminLoading && users.length === 0) {
        return <h2 className='text-center mt-5'>Loading Users...</h2>;
    }

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <h1>User Management</h1>
                    {adminError && <div className="alert alert-danger">{adminError}</div>}
                    <table className='table table-striped table-hover mt-3'>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedUsers.map((user) => (
                                <tr key={user._id}>
                                    <td><code>{user.userId || user._id}</code></td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                    <td>
    <span
    className={`badge ${
        user.role === "Super Admin"
            ? "bg-danger"
            : user.role === "Admin"
            ? "bg-success"
            : "bg-primary"
    }`}
>
    {user.role}
</span>

</td>
                                    <td className="d-flex align-items-center">
    {/* ROLE DROPDOWN */}
    <select
        className="form-select form-select-sm"
        value={user.role}
        onChange={(e) => updateUserRole(user._id, e.target.value)}
        disabled={adminLoading}
        style={{ width: "130px" }}
    >
        <option value="User">User</option>
        <option value="Admin">Admin</option>
        <option value="Super Admin">Super Admin</option>
    </select>

    {/* DELETE BUTTON */}
    <button
        className="btn btn-sm btn-outline-danger ms-2"
        onClick={() => handleDelete(user._id, user.name)}
        disabled={adminLoading}
    >
        Delete
    </button>
</td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className='d-flex justify-content-between align-items-center'>
                        <small className='text-muted'>Page {page} of {totalPages}</small>
                        <div>
                            <button className='btn btn-sm btn-outline-secondary me-2' disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                            <button className='btn btn-sm btn-outline-secondary' disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                        </div>
                    </div>
        </div>
    );
}

export default AdminUserListScreen;