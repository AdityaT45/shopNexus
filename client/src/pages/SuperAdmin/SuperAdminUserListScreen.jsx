// client/src/pages/SuperAdmin/SuperAdminUserListScreen.jsx
import React, { useEffect, useContext, useState } from 'react';
import { SuperAdminContext } from '../../context/SuperAdminContext';
import { AppContext } from '../../context/AppContext';

function SuperAdminUserListScreen() {
    const { user } = useContext(AppContext);
    const {
        users,
        fetchUsers,
        superAdminLoading,
        superAdminError,
    } = useContext(SuperAdminContext);

    // Filter states
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...users];

        if (searchTerm) {
            filtered = filtered.filter(
                (u) =>
                    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (u.userId && u.userId.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter((u) => u.role === roleFilter);
        }

        setFilteredUsers(filtered);
        setPage(1);
    }, [users, searchTerm, roleFilter]);

    if (!user || user.role !== 'Super Admin') {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Super Admin privileges required.</h2>;
    }

    if (superAdminLoading && users.length === 0) {
        return <h2 className='text-center mt-5'>Loading Users...</h2>;
    }

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className='p-4'>
            <h1 className='mb-4'>All Users</h1>
            {superAdminError && <div className='alert alert-danger'>{superAdminError}</div>}

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
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedUsers.map((userItem) => (
                            <tr key={userItem._id}>
                                <td>
                                    <code style={{ fontSize: '12px' }}>{userItem.userId || userItem._id}</code>
                                </td>
                                <td>
                                    <strong>{userItem.name}</strong>
                                </td>
                                <td>
                                    <a href={`mailto:${userItem.email}`}>{userItem.email}</a>
                                </td>
                                <td>
                                    <span
                                        className={`badge ${
                                            userItem.role === 'Super Admin'
                                                ? 'bg-danger'
                                                : userItem.role === 'Admin'
                                                ? 'bg-success'
                                                : 'bg-primary'
                                        }`}
                                    >
                                        {userItem.role}
                                    </span>
                                </td>
                                <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
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

export default SuperAdminUserListScreen;
