// client/src/pages/SuperAdmin/SuperAdminOrderListScreen.jsx
import React, { useEffect, useContext } from 'react';
import { SuperAdminContext } from '../../context/SuperAdminContext';
import { AppContext } from '../../context/AppContext';

function SuperAdminOrderListScreen() {
    const { user } = useContext(AppContext);
    const { 
        orders, 
        fetchOrders, 
        superAdminLoading, 
        superAdminError 
    } = useContext(SuperAdminContext);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!user || user.role !== 'Super Admin') {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Super Admin privileges required.</h2>;
    }

    if (superAdminLoading && orders.length === 0) {
        return <h2 className='text-center mt-5'>Loading Orders...</h2>;
    }

    return (
        <div className='p-4'>
            <h1 className='mb-4'>All Orders</h1>
            {superAdminError && <div className="alert alert-danger">{superAdminError}</div>}
            
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>User ID</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.orderId || order._id}</td>
                                <td>{order.user?.name || 'Deleted User'}</td>
                                <td>{order.user?.userId || 'N/A'}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>₹ {order.totalPrice?.toFixed(2) || '0.00'}</td>
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
                {orders.length === 0 && (
                    <p className='text-center text-muted mt-4'>No orders found.</p>
                )}
            </div>
        </div>
    );
}

export default SuperAdminOrderListScreen;






