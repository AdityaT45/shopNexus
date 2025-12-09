// client/src/pages/SuperAdmin/SuperAdminUserListScreen.jsx
import React, { useEffect, useContext } from 'react';
import { SuperAdminContext } from '../../context/SuperAdminContext';
import { AppContext } from '../../context/AppContext';

function SuperAdminUserListScreen() {
    const { user } = useContext(AppContext);
    const { 
        users, 
        fetchUsers, 
        superAdminLoading, 
        superAdminError 
    } = useContext(SuperAdminContext);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!user || user.role !== 'Super Admin') {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Super Admin privileges required.</h2>;
    }

    if (superAdminLoading && users.length === 0) {
        return <h2 className='text-center mt-5'>Loading Users...</h2>;
    }

    return (
        <div className='p-4'>
            <h1 className='mb-4'>All Users</h1>
            {superAdminError && <div className="alert alert-danger">{superAdminError}</div>}
            
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((userItem) => (
                            <tr key={userItem._id}>
                                <td>{userItem.userId || userItem._id}</td>
                                <td>{userItem.name}</td>
                                <td>{userItem.email}</td>
                                <td>
                                    <span className='badge bg-primary'>{userItem.role}</span>
                                </td>
                                <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <p className='text-center text-muted mt-4'>No users found.</p>
                )}
            </div>
        </div>
    );
}

export default SuperAdminUserListScreen;

