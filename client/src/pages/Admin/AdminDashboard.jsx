// client/src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import AdminSidebar from '../../component/Admin/AdminSidebar';

function AdminDashboard() {
    const navigate = useNavigate();
    const { 
        users, 
        allOrders, 
        adminProducts,
        fetchAllUsers, 
        fetchAllOrders, 
        fetchAdminProducts,
        adminLoading, 
        adminError, 
        isUserAdmin 
    } = useContext(AdminContext);

    useEffect(() => {
        if (isUserAdmin) {
            fetchAllUsers();
            fetchAllOrders();
            fetchAdminProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin]);

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    // Calculate statistics
    const totalUsers = (users && Array.isArray(users)) ? users.length : 0;
    const totalOrders = (allOrders && Array.isArray(allOrders)) ? allOrders.length : 0;
    const totalProducts = (adminProducts && Array.isArray(adminProducts)) ? adminProducts.length : 0;
    const pendingOrders = (allOrders && Array.isArray(allOrders)) ? allOrders.filter(order => order.status === 'Pending').length : 0;
    const totalRevenue = (allOrders && Array.isArray(allOrders)) ? allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) : 0;

    if (adminLoading && totalUsers === 0 && totalOrders === 0 && totalProducts === 0) {
        return <h2 className='text-center mt-5'>Loading Dashboard...</h2>;
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '56px' }}>
            <AdminSidebar />
            <div className='p-4 admin-content' style={{ marginLeft: '280px', paddingTop: '20px' }}>
                    <h1 className='mb-4'>Admin Dashboard</h1>
                    {adminError && <div className="alert alert-danger">{adminError}</div>}
                    
                    {/* Statistics Cards */}
                    <div className='row mb-4'>
                        <div className='col-md-3 mb-3'>
                            <div className='card bg-primary text-white'>
                                <div className='card-body'>
                                    <h5 className='card-title'>Total Users</h5>
                                    <h2>{totalUsers}</h2>
                                    <button 
                                        className='btn btn-light btn-sm mt-2'
                                        onClick={() => navigate('/admin/users')}
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <div className='card bg-success text-white'>
                                <div className='card-body'>
                                    <h5 className='card-title'>Total Products</h5>
                                    <h2>{totalProducts}</h2>
                                    <button 
                                        className='btn btn-light btn-sm mt-2'
                                        onClick={() => navigate('/admin/products')}
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <div className='card bg-warning text-white'>
                                <div className='card-body'>
                                    <h5 className='card-title'>Total Orders</h5>
                                    <h2>{totalOrders}</h2>
                                    <small>Pending: {pendingOrders}</small>
                                    <button 
                                        className='btn btn-light btn-sm mt-2'
                                        onClick={() => navigate('/admin/orders')}
                                    >
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <div className='card bg-info text-white'>
                                <div className='card-body'>
                                    <h5 className='card-title'>Total Revenue</h5>
                                    <h2>₹ {totalRevenue.toFixed(2)}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className='card'>
                        <div className='card-header d-flex justify-content-between align-items-center'>
                            <h5 className='mb-0'>Recent Orders</h5>
                            <button 
                                className='btn btn-sm btn-outline-primary'
                                onClick={() => navigate('/admin/orders')}
                            >
                                View All Orders
                            </button>
                        </div>
                        <div className='card-body'>
                            {totalOrders === 0 ? (
                                <p className='text-muted'>No orders yet.</p>
                            ) : (
                                <div className='table-responsive'>
                                    <table className='table table-hover'>
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>User</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(allOrders && Array.isArray(allOrders) ? allOrders : []).slice(0, 5).map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order._id.substring(order._id.length - 6)}</td>
                                                    <td>{order.user?.name || 'Deleted User'}</td>
                                                    <td>₹ {order.totalPrice.toFixed(2)}</td>
                                                    <td>
                                                        <span className={`badge bg-${order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'info' : 'warning'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

