// client/src/pages/Admin/AdminUserListScreen.jsx
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
        isUserAdmin,
    } = useContext(AdminContext);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        if (isUserAdmin) {
            fetchAllUsers();
        }
        if (adminError) {
            console.error(adminError);
        }
    }, [isUserAdmin, adminError, fetchAllUsers]);

    // Apply filters
    useEffect(() => {
        let filtered = [...users];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (u.userId && u.userId.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter((u) => u.role === roleFilter);
        }

        setFilteredUsers(filtered);
        setPage(1);
    }, [users, searchTerm, roleFilter]);

    const handleRoleChange = (userId, currentRole) => {
        const newRole = currentRole === 'Admin' ? 'User' : 'Admin';

        if (window.confirm(`Change role to ${newRole}?`)) {
            updateUserRole(userId, newRole);
        }
    };

    const handleDelete = (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
            deleteUser(userId);
        }
    };

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

    if (adminLoading && users.length === 0) {
        return <h2 className='text-center mt-5'>Loading Users...</h2>;
    }

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <h1>User Management</h1>
            {adminError && <div className='alert alert-danger'>{adminError}</div>}

            {/* Filters */}
            <div className='card mb-4'>
                <div className='card-body'>
                    <div className='row g-3'>
                        <div className='col-md-6'>
                            <label className='form-label'>Search</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Search by name, email or user ID...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <label className='form-label'>Role</label>
                            <select
                                className='form-select'
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value='all'>All Roles</option>
                                <option value='User'>User</option>
                                <option value='Admin'>Admin</option>
                                <option value='Super Admin'>Super Admin</option>
                            </select>
                        </div>
                        <div className='col-md-2 d-flex align-items-end'>
                            <button
                                className='btn btn-outline-secondary w-100'
                                onClick={() => {
                                    setSearchTerm('');
                                    setRoleFilter('all');
                                }}
                            >
                                <i className='fas fa-times me-1'></i> Clear
                            </button>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <small className='text-muted'>
                            Showing {filteredUsers.length} of {users.length} users
                        </small>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead className='table-dark'>
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
                                <td>
                                    <code style={{ fontSize: '12px' }}>{user.userId || user._id}</code>
                                </td>
                                <td>
                                    <strong>{user.name}</strong>
                                </td>
                                <td>
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td>
                                    <span
                                        className={`badge ${
                                            user.role === 'Super Admin'
                                                ? 'bg-danger'
                                                : user.role === 'Admin'
                                                ? 'bg-success'
                                                : 'bg-primary'
                                        }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className='d-flex align-items-center gap-2'>
                                    <select
                                        className='form-select form-select-sm'
                                        style={{ width: '130px' }}
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                        disabled={adminLoading || user.role === 'Super Admin'}
                                    >
                                        <option value='User'>User</option>
                                        <option value='Admin'>Admin</option>
                                        <option value='Super Admin' disabled>Super Admin</option>
                                    </select>
                                    <button
                                        className='btn btn-sm btn-outline-danger'
                                        onClick={() => handleDelete(user._id, user.name)}
                                        disabled={adminLoading || user.role === 'Super Admin'}
                                        title={user.role === 'Super Admin' ? 'Cannot delete Super Admin' : 'Delete'}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pagedUsers.length === 0 && (
                    <p className='text-center text-muted mt-4'>No users found matching the filters.</p>
                )}
            </div>

            {/* Pagination */}
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <small className='text-muted'>
                    Page {page} of {totalPages} ({filteredUsers.length} users)
                </small>
                <div>
                    <button
                        className='btn btn-sm btn-outline-secondary me-2'
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <i className='fas fa-chevron-left'></i> Prev
                    </button>
                    <button
                        className='btn btn-sm btn-outline-secondary'
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next <i className='fas fa-chevron-right'></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminUserListScreen;
