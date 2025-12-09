// client/src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

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
    const { topProducts, fetchTopProducts } = useContext(AppContext);

    useEffect(() => {
        if (isUserAdmin) {
            fetchAllUsers();
            fetchAllOrders();
            fetchAdminProducts();
            fetchTopProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin, fetchTopProducts]);

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    // Calculate statistics
    const totalUsers = (users && Array.isArray(users)) ? users.length : 0;
    const totalOrders = (allOrders && Array.isArray(allOrders)) ? allOrders.length : 0;
    const totalProducts = (adminProducts && Array.isArray(adminProducts)) ? adminProducts.length : 0;
    const pendingOrders = (allOrders && Array.isArray(allOrders)) ? allOrders.filter(order => order.status === 'Pending').length : 0;
    const totalRevenue = (allOrders && Array.isArray(allOrders)) ? allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) : 0;

    const statusBreakdown = useMemo(() => {
        const map = { Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
        if (allOrders && Array.isArray(allOrders)) {
            allOrders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
        }
        return map;
    }, [allOrders]);

    const revenueLast30Days = useMemo(() => {
        if (!allOrders) return 0;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        return allOrders
            .filter(o => new Date(o.createdAt) >= cutoff && o.status !== 'Cancelled')
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    }, [allOrders]);

    const outOfStock = useMemo(() => {
        if (!adminProducts) return 0;
        return adminProducts.filter(p => p.countInStock === 0).length;
    }, [adminProducts]);

    const lowStock = useMemo(() => {
        if (!adminProducts) return 0;
        return adminProducts.filter(p => p.countInStock > 0 && p.countInStock < 10).length;
    }, [adminProducts]);

    if (adminLoading && totalUsers === 0 && totalOrders === 0 && totalProducts === 0) {
        return <h2 className='text-center mt-5'>Loading Dashboard...</h2>;
    }

    return (
        <div className='p-4' style={{ paddingTop: '20px' }}>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <div>
                    <h1 className='mb-1'>Admin Dashboard</h1>
                    <p className='text-muted mb-0'>Overview of store performance</p>
                </div>
            </div>
            {adminError && <div className="alert alert-danger">{adminError}</div>}
                    
            {/* Statistics Cards */}
            <div className='row mb-4'>
                <div className='col-md-3 mb-3'>
                    <div className='card bg-primary text-white border-0 shadow-sm'>
                        <div className='card-body'>
                            <h6 className='card-title mb-2 opacity-75'>Total Users</h6>
                            <h2 className='mb-0'>{totalUsers}</h2>
                            <small className='opacity-75'>All registered users</small>
                            <button 
                                className='btn btn-light btn-sm mt-3 w-100'
                                onClick={() => navigate('/admin/users')}
                            >
                                Manage Users
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 mb-3'>
                    <div className='card bg-success text-white border-0 shadow-sm'>
                        <div className='card-body'>
                            <h6 className='card-title mb-2 opacity-75'>Total Products</h6>
                            <h2 className='mb-0'>{totalProducts}</h2>
                            <small className='opacity-75'>Out of stock: {outOfStock}</small>
                            <button 
                                className='btn btn-light btn-sm mt-3 w-100'
                                onClick={() => navigate('/admin/products')}
                            >
                                Manage Products
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 mb-3'>
                    <div className='card bg-warning text-white border-0 shadow-sm'>
                        <div className='card-body'>
                            <h6 className='card-title mb-2 opacity-75'>Total Orders</h6>
                            <h2 className='mb-0'>{totalOrders}</h2>
                            <small className='opacity-75'>Pending: {pendingOrders}</small>
                            <button 
                                className='btn btn-light btn-sm mt-3 w-100'
                                onClick={() => navigate('/admin/orders')}
                            >
                                Manage Orders
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 mb-3'>
                    <div className='card bg-info text-white border-0 shadow-sm'>
                        <div className='card-body'>
                            <h6 className='card-title mb-2 opacity-75'>Total Revenue</h6>
                            <h2 className='mb-0'>₹ {totalRevenue.toFixed(2)}</h2>
                            <small className='opacity-75'>Last 30d: ₹ {revenueLast30Days.toFixed(2)}</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown & Stock Alerts */}
            <div className='row mb-4'>
                <div className='col-lg-6 mb-4'>
                    <div className='card border shadow-sm h-100'>
                        <div className='card-header bg-light'>
                            <h5 className='mb-0'><i className='fas fa-chart-pie me-2 text-primary'></i>Order Status Breakdown</h5>
                        </div>
                        <div className='card-body'>
                            {Object.entries(statusBreakdown).map(([status, count]) => {
                                const percentage = totalOrders ? ((count / totalOrders) * 100).toFixed(1) : 0;
                                const colors = { Pending: 'warning', Shipped: 'info', Delivered: 'success', Cancelled: 'danger' };
                                return (
                                    <div key={status} className='mb-3'>
                                        <div className='d-flex justify-content-between mb-1'>
                                            <span className='fw-bold'>{status}</span>
                                            <span className='text-muted'>{count} ({percentage}%)</span>
                                        </div>
                                        <div className='progress' style={{ height: '18px' }}>
                                            <div className={`progress-bar bg-${colors[status] || 'secondary'}`} style={{ width: `${percentage}%` }}>
                                                {count}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {totalOrders === 0 && <p className='text-muted text-center mb-0'>No orders yet</p>}
                        </div>
                    </div>
                </div>

                <div className='col-lg-6 mb-4'>
                    <div className='card border shadow-sm h-100'>
                        <div className='card-header bg-light'>
                            <h5 className='mb-0'><i className='fas fa-box-open me-2 text-warning'></i>Stock Alerts</h5>
                        </div>
                        <div className='card-body'>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <span>Out of Stock</span>
                                <span className='badge bg-danger'>{outOfStock}</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center mb-3'>
                                <span>Low Stock (&lt;10)</span>
                                <span className='badge bg-warning text-dark'>{lowStock}</span>
                            </div>
                            <button className='btn btn-outline-warning btn-sm w-100' onClick={() => navigate('/admin/products')}>
                                Review Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Selling Products */}
            {topProducts && topProducts.length > 0 && (
                <div className='card border shadow-sm mb-4'>
                    <div className='card-header bg-light d-flex justify-content-between align-items-center'>
                        <h5 className='mb-0'><i className='fas fa-trophy me-2 text-warning'></i>Top Selling Products</h5>
                        <button className='btn btn-sm btn-outline-primary' onClick={() => navigate('/admin/products')}>
                            Manage Products
                        </button>
                    </div>
                    <div className='card-body'>
                        <div className='row'>
                            {topProducts.slice(0, 6).map((product, index) => (
                                <div key={product.productId || product._id || index} className='col-lg-4 col-md-6 mb-3'>
                                    <div className='card h-100 border-0 shadow-sm'>
                                        <div className='card-body d-flex'>
                                            <span className='badge bg-warning text-dark me-3' style={{ height: 'fit-content' }}>#{index + 1}</span>
                                            <div className='flex-grow-1'>
                                                <h6 className='mb-1'>{product.name}</h6>
                                                <small className='text-muted d-block'>ID: {product.productId || product._id}</small>
                                                <div className='d-flex justify-content-between mt-2'>
                                                    <small className='text-muted'>Sold: <strong>{product.totalSold}</strong></small>
                                                    <small className='text-success'>₹ {product.totalRevenue?.toFixed(2) || '0.00'}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            <div className='card border shadow-sm'>
                <div className='card-header bg-light d-flex justify-content-between align-items-center'>
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
                                                    <td><code>{order.orderId || order._id}</code></td>
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
    );
}

export default AdminDashboard;

