// client/src/pages/MyOrdersScreen.jsx
import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function MyOrdersScreen() {
    // 🔑 CONTEXT: Consume state and actions
    const { myOrders, fetchMyOrders, isLoading, error } = useContext(AppContext);

    useEffect(() => {
        // 🔑 ACTION: Fetch the user's order history
        fetchMyOrders();
        
        if (error) { console.error(error); }
    }, []); 

    if (isLoading) { return <h2 className='text-center mt-5'>Loading Order History...</h2>; }

    return (
        <div className='container mt-5'>
            <h1>My Order History</h1>
            
            {myOrders.length === 0 ? (
                <p className='lead'>You have not placed any orders yet.</p>
            ) : (
                <div className='list-group'>
                    {myOrders.map((order) => (
                        <div key={order._id} className='list-group-item list-group-item-action mb-3'>
                            <div className='d-flex w-100 justify-content-between'>
                                <h5 className='mb-1'>Order ID: {order._id}</h5>
                                <small className='text-muted'>
                                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                            <p className='mb-1'>
                                Status: <span className={`badge bg-${order.status === 'Pending'
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
                            </p>
                            <p className='mb-1'>
                                Items: {order.items ? order.items.reduce((acc, item) => acc + item.quantity, 0) : 0} total
                            </p>
                            <p className='mb-1'>
                                **Total: ₹ {order.totalPrice.toFixed(2)}**
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrdersScreen;