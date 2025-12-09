// client/src/pages/SuperAdmin/SuperAdminAdminListScreen.jsx
import React, { useEffect, useContext, useState } from 'react';
import { SuperAdminContext } from '../../context/SuperAdminContext';
import { AppContext } from '../../context/AppContext';

function SuperAdminAdminListScreen() {
    const { user } = useContext(AppContext);
    const { 
        admins, 
        users,
        fetchAdmins, 
        fetchUsers,
        promoteToAdmin, 
        demoteFromAdmin, 
        superAdminLoading, 
        superAdminError 
    } = useContext(SuperAdminContext);

    const [showUserList, setShowUserList] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        fetchAdmins();
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePromote = async () => {
        if (!selectedUserId) {
            alert('Please select a user to promote');
            return;
        }
        if (window.confirm('Are you sure you want to promote this user to Admin?')) {
            const success = await promoteToAdmin(selectedUserId);
            if (success) {
                setSelectedUserId('');
                setShowUserList(false);
            }
        }
    };

    const handleDemote = async (adminId) => {
        if (window.confirm('Are you sure you want to demote this admin to User?')) {
            await demoteFromAdmin(adminId);
        }
    };

    if (!user || user.role !== 'Super Admin') {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Super Admin privileges required.</h2>;
    }

    if (superAdminLoading && admins.length === 0) {
        return <h2 className='text-center mt-5'>Loading Admins...</h2>;
    }

    return (
        <div className='p-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>Admin Management</h1>
                <button 
                    className='btn btn-success'
                    onClick={() => setShowUserList(!showUserList)}
                >
                    <i className="fas fa-plus me-1"></i> Add Admin
                </button>
            </div>

            {superAdminError && <div className="alert alert-danger">{superAdminError}</div>}

            {/* Add Admin Form */}
            {showUserList && (
                <div className='card mb-4'>
                    <div className='card-header'>
                        <h5>Promote User to Admin</h5>
                    </div>
                    <div className='card-body'>
                        <div className='mb-3'>
                            <label className='form-label'>Select User</label>
                            <select
                                className='form-select'
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                <option value=''>Choose a user...</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user.userId || user._id}>
                                        {user.name} ({user.email}) - {user.userId || user._id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='d-flex gap-2'>
                            <button 
                                className='btn btn-primary'
                                onClick={handlePromote}
                                disabled={superAdminLoading || !selectedUserId}
                            >
                                Promote to Admin
                            </button>
                            <button 
                                className='btn btn-secondary'
                                onClick={() => {
                                    setShowUserList(false);
                                    setSelectedUserId('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admins List */}
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin._id}>
                                <td>{admin.userId || admin._id}</td>
                                <td>{admin.name}</td>
                                <td>{admin.email}</td>
                                <td>
                                    <span className='badge bg-success'>{admin.role}</span>
                                </td>
                                <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className='btn btn-sm btn-danger'
                                        onClick={() => handleDemote(admin.userId || admin._id)}
                                        disabled={superAdminLoading}
                                    >
                                        <i className='fas fa-user-minus me-1'></i>
                                        Demote to User
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {admins.length === 0 && (
                    <p className='text-center text-muted mt-4'>No admins found. Promote a user to admin.</p>
                )}
            </div>
        </div>
    );
}

export default SuperAdminAdminListScreen;

