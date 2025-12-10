// client/src/pages/SuperAdmin/SuperAdminOrderListScreen.jsx
import React, { useEffect, useContext, useState } from 'react';
import { SuperAdminContext } from '../../context/SuperAdminContext';
import { AppContext } from '../../context/AppContext';

function SuperAdminOrderListScreen() {
    const { user } = useContext(AppContext);
    const {
        orders,
        fetchOrders,
        superAdminLoading,
        superAdminError,
    } = useContext(SuperAdminContext);

    // Filter states
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...orders];

        if (searchTerm) {
            filtered = filtered.filter(
                (o) =>
                    (o.orderId && o.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (o.user?.name && o.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (o.user?.email && o.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((o) => o.status === statusFilter);
        }

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
    }, [orders, searchTerm, statusFilter, dateFilter]);

    if (!user || user.role !== 'Super Admin') {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Super Admin privileges required.</h2>;
    }

    if (superAdminLoading && orders.length === 0) {
        return <h2 className='text-center mt-5'>Loading Orders...</h2>;
    }

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
    const pagedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className='p-4'>
            <h1 className='mb-4'>All Orders</h1>
            {superAdminError && <div className='alert alert-danger'>{superAdminError}</div>}

            {/* Filters */}
            <div className='mb-3 p-3 bg-light rounded border'>
                <div className='row g-2 align-items-end'>
                    <div className='col-md-4'>
                        <label className='form-label small text-muted mb-1'>Search</label>
                        <input
                            type='text'
                            className='form-control form-control-sm'
                            placeholder='Search by Order ID, User name or email...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='col-md-3'>
                        <label className='form-label small text-muted mb-1'>Status</label>
                        <select
                            className='form-select form-select-sm'
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
                        <label className='form-label small text-muted mb-1'>Date Range</label>
                        <select
                            className='form-select form-select-sm'
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option value='all'>All Time</option>
                            <option value='today'>Today</option>
                            <option value='week'>Last 7 Days</option>
                            <option value='month'>Last 30 Days</option>
                        </select>
                    </div>
                    <div className='col-md-2'>
                        <div className='d-flex gap-2'>
                            <button
                                className='btn btn-outline-secondary btn-sm flex-fill'
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setDateFilter('all');
                                }}
                            >
                                <i className='fas fa-times me-1'></i> Clear
                            </button>
                            <span className='badge bg-secondary align-self-center'>
                                {filteredOrders.length}/{orders.length}
                            </span>
                        </div>
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
                            <th>User ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
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
                                    <code style={{ fontSize: '12px' }}>{order.user?.userId || 'N/A'}</code>
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
                                    <strong className='text-success'>₹{order.totalPrice?.toFixed(2) || '0.00'}</strong>
                                </td>
                                <td>
                                    <span
                                        className={`badge bg-${
                                            order.status === 'Delivered'
                                                ? 'success'
                                                : order.status === 'Shipped'
                                                ? 'info'
                                                : order.status === 'Processing'
                                                ? 'primary'
                                                : order.status === 'Cancelled'
                                                ? 'danger'
                                                : 'warning'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
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

export default SuperAdminOrderListScreen;
