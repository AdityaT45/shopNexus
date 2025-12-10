// client/src/pages/Admin/AdminOrderListScreen.jsx
import React, { useEffect, useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

function AdminOrderListScreen() {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const {
        allOrders,
        fetchAllOrders,
        updateOrderStatus,
        adminLoading,
        adminError,
        isUserAdmin,
    } = useContext(AdminContext);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
    const [filteredOrders, setFilteredOrders] = useState([]);

    // Local state to track which order is currently being updated
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    useEffect(() => {
        if (isUserAdmin) {
            fetchAllOrders();
        }
        if (adminError) {
            console.error('Admin Error:', adminError);
        }
    }, [isUserAdmin, adminError, fetchAllOrders]);

    // Apply filters
    useEffect(() => {
        let filtered = [...allOrders];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (o) =>
                    (o.orderId && o.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (o.user?.name && o.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (o.user?.email && o.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((o) => o.status === statusFilter);
        }

        // Date filter
        const now = new Date();
        if (dateFilter === 'today') {
            filtered = filtered.filter((o) => {
                const orderDate = new Date(o.createdAt);
                return orderDate.toDateString() === now.toDateString();
            });
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter((o) => new Date(o.createdAt) >= weekAgo);
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter((o) => new Date(o.createdAt) >= monthAgo);
        }

        setFilteredOrders(filtered);
        setPage(1);
    }, [allOrders, searchTerm, statusFilter, dateFilter]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        await updateOrderStatus(orderId, newStatus);
        setUpdatingOrderId(null);
    };

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
    const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

    if (adminLoading && allOrders.length === 0) {
        return <h2 className='text-center mt-5'>Loading Orders...</h2>;
    }

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <h1>Order Management</h1>
            {adminError && <div className='alert alert-danger'>{adminError}</div>}

            {/* Filters */}
            <div className='card mb-4'>
                <div className='card-body'>
                    <div className='row g-3'>
                        <div className='col-md-4'>
                            <label className='form-label'>Search</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Search by Order ID, User name or email...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='col-md-3'>
                            <label className='form-label'>Status</label>
                            <select
                                className='form-select'
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value='all'>All Status</option>
                                <option value='Pending'>Pending</option>
                                <option value='Shipped'>Shipped</option>
                                <option value='Delivered'>Delivered</option>
                            </select>
                        </div>
                        <div className='col-md-3'>
                            <label className='form-label'>Date Range</label>
                            <select
                                className='form-select'
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >
                                <option value='all'>All Time</option>
                                <option value='today'>Today</option>
                                <option value='week'>Last 7 Days</option>
                                <option value='month'>Last 30 Days</option>
                            </select>
                        </div>
                        <div className='col-md-2 d-flex align-items-end'>
                            <button
                                className='btn btn-outline-secondary w-100'
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setDateFilter('all');
                                }}
                            >
                                <i className='fas fa-times me-1'></i> Clear
                            </button>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <small className='text-muted'>
                            Showing {filteredOrders.length} of {allOrders.length} orders
                        </small>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedOrders.map((order) => (
                            <tr key={order._id}>
                                <td>
                                    <code style={{ fontSize: '12px' }}>{order.orderId || order._id}</code>
                                </td>
                                <td>
                                    <div>
                                        <strong>{order.user?.name || 'Deleted User'}</strong>
                                        {order.user?.email && (
                                            <div>
                                                <small className='text-muted'>{order.user.email}</small>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>
                                <td>
                                    <span className='badge bg-info'>
                                        {order.orderItems?.length || 0} item(s)
                                    </span>
                                </td>
                                <td>
                                    <strong className='text-success'>₹{order.totalPrice.toFixed(2)}</strong>
                                </td>
                                <td>
                                    <span
                                        className={`badge bg-${
                                            order.status === 'Pending'
                                                ? 'warning'
                                                : order.status === 'Shipped'
                                                ? 'primary'
                                                : order.status === 'Delivered'
                                                ? 'success'
                                                : 'secondary'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        className='form-select form-select-sm'
                                        style={{ minWidth: '130px' }}
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        disabled={adminLoading || updatingOrderId === order._id}
                                    >
                                        <option value='Pending'>Pending</option>
                                        <option value='Shipped'>Shipped</option>
                                        <option value='Delivered'>Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pagedOrders.length === 0 && (
                    <p className='text-center text-muted mt-4'>No orders found matching the filters.</p>
                )}
            </div>

            {/* Pagination */}
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <small className='text-muted'>
                    Page {page} of {totalPages} ({filteredOrders.length} orders)
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

export default AdminOrderListScreen;
