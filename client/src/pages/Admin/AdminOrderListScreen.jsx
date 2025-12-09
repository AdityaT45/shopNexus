// client/src/pages/AdminOrderListScreen.jsx
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
        isUserAdmin 
    } = useContext(AdminContext);

    // Local state to track which order is currently being updated
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    useEffect(() => {
        // Fetch data only if the user is confirmed as admin in the context state
        if (isUserAdmin) {
            fetchAllOrders();
        }
        if (adminError) {
            console.error('Admin Error:', adminError);
        }
    }, [isUserAdmin, adminError]);


    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        await updateOrderStatus(orderId, newStatus);
        setUpdatingOrderId(null);
    };

    const totalPages = Math.max(1, Math.ceil(allOrders.length / pageSize));
    const pagedOrders = allOrders.slice((page - 1) * pageSize, page * pageSize);

    if (adminLoading && allOrders.length === 0) {
        return <h2 className='text-center mt-5'>Loading Orders...</h2>;
    }

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <h1>Order Management</h1>
                    {adminError && <div className="alert alert-danger">{adminError}</div>}
                    <table className='table table-striped table-hover mt-3'>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedOrders.map((order) => (
                                <tr key={order._id}>
                                    <td><code>{order.orderId || order._id}</code></td>
                                    <td>{order.user?.name || 'Deleted User'}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                    <td>₹ {order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge bg-${order.status === 'Pending'
        ? 'warning'
        : order.status === 'Shipped'
        ? 'primary'
        : order.status === 'Delivered'
        ? 'success'
        : 'secondary' // fallback
    }`}
>
    {order.status}
</span>
                                    </td>
                                    <td>
                                        <select 
                                            className='form-select form-select-sm'
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

export default AdminOrderListScreen;
