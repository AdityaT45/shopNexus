// client/src/pages/SuperAdmin/SuperAdminDashboard.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminContext } from '../../context/SuperAdminContext';
import { AppContext } from '../../context/AppContext';

function SuperAdminDashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const { 
        stats, 
        fetchDashboardStats, 
        superAdminLoading, 
        superAdminError 
    } = useContext(SuperAdminContext);

    useEffect(() => {
        fetchDashboardStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!user || user.role !== 'Super Admin') {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Super Admin privileges required.</h2>;
    }

    if (superAdminLoading && !stats) {
        return <h2 className='text-center mt-5'>Loading Dashboard...</h2>;
    }

    const orderStatusBreakdown = stats?.orderStatusBreakdown || {};
    const totalOrdersForStatus = stats?.totalOrders || 1;
    const revenueGrowth7Days = stats?.revenueLast7Days || 0;
    const revenueGrowth30Days = stats?.revenueLast30Days || 0;

    return (
        <div className='p-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <div>
                    <h1 className='mb-1'>Super Admin Dashboard</h1>
                    <p className='text-muted mb-0'>Welcome back, {user?.name || 'Super Admin'}!</p>
                </div>
                <div className='text-end'>
                    <small className='text-muted d-block'>Last updated: {new Date().toLocaleTimeString()}</small>
                </div>
            </div>
            
            {superAdminError && <div className="alert alert-danger">{superAdminError}</div>}
            
            {/* Main Statistics Cards */}
            <div className='row mb-4'>
                <div className='col-lg-3 col-md-6 mb-3'>
                    <div className='card bg-primary text-white border-0 shadow-sm'>
                        <div className='card-body'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    <h6 className='card-title mb-2 opacity-75'>Total Users</h6>
                                    <h2 className='mb-0'>{stats?.totalUsers || 0}</h2>
                                    <small className='opacity-75'>
                                        +{stats?.newUsersLast7Days || 0} this week
                                    </small>
                                </div>
                                <div style={{ fontSize: '3rem', opacity: 0.3 }}>
                                    <i className='fas fa-users'></i>
                                </div>
                            </div>
                            <button 
                                className='btn btn-light btn-sm mt-3 w-100'
                                onClick={() => navigate('/superadmin/users')}
                            >
                                View All <i className='fas fa-arrow-right ms-1'></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='col-lg-3 col-md-6 mb-3'>
                    <div className='card bg-success text-white border-0 shadow-sm'>
                        <div className='card-body'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    <h6 className='card-title mb-2 opacity-75'>Total Admins</h6>
                                    <h2 className='mb-0'>{stats?.totalAdmins || 0}</h2>
                                    <small className='opacity-75'>Active administrators</small>
                                </div>
                                <div style={{ fontSize: '3rem', opacity: 0.3 }}>
                                    <i className='fas fa-user-shield'></i>
                                </div>
                            </div>
                            <button 
                                className='btn btn-light btn-sm mt-3 w-100'
                                onClick={() => navigate('/superadmin/admins')}
                            >
                                Manage <i className='fas fa-cog ms-1'></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='col-lg-3 col-md-6 mb-3'>
                    <div className='card bg-info text-white border-0 shadow-sm'>
                        <div className='card-body'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    <h6 className='card-title mb-2 opacity-75'>Total Products</h6>
                                    <h2 className='mb-0'>{stats?.totalProducts || 0}</h2>
                                    <small className='opacity-75'>
                                        {stats?.outOfStockProducts || 0} out of stock
                                    </small>
                                </div>
                                <div style={{ fontSize: '3rem', opacity: 0.3 }}>
                                    <i className='fas fa-box-open'></i>
                                </div>
                            </div>
                            <button 
                                className='btn btn-light btn-sm mt-3 w-100'
                                onClick={() => navigate('/superadmin/products')}
                            >
                                View All <i className='fas fa-arrow-right ms-1'></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='col-lg-3 col-md-6 mb-3'>
                    <div className='card bg-warning text-white border-0 shadow-sm'>
                        <div className='card-body'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                    <h6 className='card-title mb-2 opacity-75'>Total Orders</h6>
                                    <h2 className='mb-0'>{stats?.totalOrders || 0}</h2>
                                    <small className='opacity-75'>
                                        {stats?.pendingOrders || 0} pending
                                    </small>
                                </div>
                                <div style={{ fontSize: '3rem', opacity: 0.3 }}>
                                    <i className='fas fa-shopping-basket'></i>
                                </div>
                            </div>
                            <button 
                                className='btn btn-light btn-sm mt-3 w-100'
                                onClick={() => navigate('/superadmin/orders')}
                            >
                                View All <i className='fas fa-arrow-right ms-1'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Section */}
            <div className='row mb-4'>
                <div className='col-lg-4 col-md-6 mb-3'>
                    <div className='card bg-success text-white border-0 shadow-sm h-100'>
                        <div className='card-body'>
                            <h5 className='card-title d-flex align-items-center'>
                                <i className='fas fa-rupee-sign me-2'></i>
                                Total Revenue
                            </h5>
                            <h2 className='mb-3'>₹ {stats?.totalRevenue?.toFixed(2) || '0.00'}</h2>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <small className='opacity-75 d-block'>Last 7 Days</small>
                                    <strong>₹ {revenueGrowth7Days.toFixed(2)}</strong>
                                </div>
                                <div className='text-end'>
                                    <small className='opacity-75 d-block'>Last 30 Days</small>
                                    <strong>₹ {revenueGrowth30Days.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-lg-4 col-md-6 mb-3'>
                    <div className='card border shadow-sm h-100'>
                        <div className='card-body'>
                            <h5 className='card-title d-flex align-items-center'>
                                <i className='fas fa-user-plus text-primary me-2'></i>
                                User Growth
                            </h5>
                            <div className='mb-3'>
                                <div className='d-flex justify-content-between mb-2'>
                                    <span>Last 7 Days</span>
                                    <strong>{stats?.newUsersLast7Days || 0}</strong>
                                </div>
                                <div className='progress' style={{ height: '8px' }}>
                                    <div 
                                        className='progress-bar bg-primary' 
                                        style={{ width: `${Math.min((stats?.newUsersLast7Days || 0) * 10, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className='d-flex justify-content-between mb-2'>
                                    <span>Last 30 Days</span>
                                    <strong>{stats?.newUsersLast30Days || 0}</strong>
                                </div>
                                <div className='progress' style={{ height: '8px' }}>
                                    <div 
                                        className='progress-bar bg-info' 
                                        style={{ width: `${Math.min((stats?.newUsersLast30Days || 0) * 5, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-lg-4 col-md-6 mb-3'>
                    <div className='card border shadow-sm h-100'>
                        <div className='card-body'>
                            <h5 className='card-title d-flex align-items-center'>
                                <i className='fas fa-exclamation-triangle text-warning me-2'></i>
                                Stock Alerts
                            </h5>
                            <div className='mb-3'>
                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                    <span>Out of Stock</span>
                                    <span className='badge bg-danger'>{stats?.outOfStockProducts || 0}</span>
                                </div>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <span>Low Stock (&lt;10)</span>
                                    <span className='badge bg-warning text-dark'>{stats?.lowStockProducts || 0}</span>
                                </div>
                            </div>
                            <button 
                                className='btn btn-outline-warning btn-sm w-100 mt-2'
                                onClick={() => navigate('/superadmin/products')}
                            >
                                Check Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Status Breakdown & Recent Orders */}
            <div className='row mb-4'>
                <div className='col-lg-6 mb-4'>
                    <div className='card border shadow-sm h-100'>
                        <div className='card-header bg-light'>
                            <h5 className='mb-0'>
                                <i className='fas fa-chart-pie me-2 text-primary'></i>
                                Order Status Breakdown
                            </h5>
                        </div>
                        <div className='card-body'>
                            {Object.entries(orderStatusBreakdown).map(([status, count]) => {
                                const percentage = ((count / totalOrdersForStatus) * 100).toFixed(1);
                                const statusColors = {
                                    'Pending': 'warning',
                                    'Processing': 'info',
                                    'Shipped': 'primary',
                                    'Delivered': 'success',
                                    'Cancelled': 'danger'
                                };
                                return (
                                    <div key={status} className='mb-3'>
                                        <div className='d-flex justify-content-between mb-1'>
                                            <span className='fw-bold'>{status}</span>
                                            <span className='text-muted'>{count} ({percentage}%)</span>
                                        </div>
                                        <div className='progress' style={{ height: '20px' }}>
                                            <div 
                                                className={`progress-bar bg-${statusColors[status] || 'secondary'}`}
                                                style={{ width: `${percentage}%` }}
                                            >
                                                {count}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {Object.keys(orderStatusBreakdown).length === 0 && (
                                <p className='text-muted text-center'>No orders yet</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className='col-lg-6 mb-4'>
                    <div className='card border shadow-sm h-100'>
                        <div className='card-header bg-light d-flex justify-content-between align-items-center'>
                            <h5 className='mb-0'>
                                <i className='fas fa-clock me-2 text-info'></i>
                                Recent Orders
                            </h5>
                            <button 
                                className='btn btn-sm btn-outline-primary'
                                onClick={() => navigate('/superadmin/orders')}
                            >
                                View All
                            </button>
                        </div>
                        <div className='card-body' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                <div className='table-responsive'>
                                    <table className='table table-sm'>
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>User</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentOrders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>
                                                        <small className='text-muted'>
                                                            {order.orderId ? order.orderId.slice(-8) : order._id.slice(-8)}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <small>{order.user?.name || 'Deleted User'}</small>
                                                    </td>
                                                    <td>
                                                        <strong>₹ {order.totalPrice?.toFixed(2) || '0.00'}</strong>
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${
                                                            order.status === 'Delivered' ? 'success' : 
                                                            order.status === 'Shipped' ? 'info' : 
                                                            order.status === 'Processing' ? 'primary' :
                                                            order.status === 'Cancelled' ? 'danger' : 'warning'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className='text-muted text-center'>No recent orders</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            {stats?.topProducts && stats.topProducts.length > 0 && (
                <div className='row mb-4'>
                    <div className='col-12'>
                        <div className='card border shadow-sm'>
                            <div className='card-header bg-light d-flex justify-content-between align-items-center'>
                                <h5 className='mb-0'>
                                    <i className='fas fa-trophy me-2 text-warning'></i>
                                    Top Selling Products
                                </h5>
                                <button 
                                    className='btn btn-sm btn-outline-primary'
                                    onClick={() => navigate('/superadmin/products')}
                                >
                                    View All Products
                                </button>
                            </div>
                            <div className='card-body'>
                                <div className='row'>
                                    {stats.topProducts.map((product, index) => (
                                        <div key={index} className='col-lg-4 col-md-6 mb-3'>
                                            <div className='card border h-100'>
                                                <div className='card-body'>
                                                    <div className='d-flex align-items-center'>
                                                        <div className='me-3'>
                                                            <span className='badge bg-warning text-dark' style={{ fontSize: '1.2rem' }}>
                                                                #{index + 1}
                                                            </span>
                                                        </div>
                                                        {product.image && (
                                                            <img 
                                                                src={product.image} 
                                                                alt={product.name}
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/50x50?text=Product';
                                                                }}
                                                            />
                                                        )}
                                                        <div className='ms-3 flex-grow-1'>
                                                            <h6 className='mb-1'>{product.name}</h6>
                                                            <small className='text-muted d-block'>ID: {product.productId}</small>
                                                        </div>
                                                    </div>
                                                    <hr className='my-2' />
                                                    <div className='d-flex justify-content-between'>
                                                        <div>
                                                            <small className='text-muted d-block'>Units Sold</small>
                                                            <strong>{product.totalSold}</strong>
                                                        </div>
                                                        <div className='text-end'>
                                                            <small className='text-muted d-block'>Revenue</small>
                                                            <strong className='text-success'>₹ {product.totalRevenue?.toFixed(2) || '0.00'}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SuperAdminDashboard;

