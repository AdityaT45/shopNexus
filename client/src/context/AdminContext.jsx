// client/src/context/AdminContext.js
import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { adminInitialState } from './AdminInitialState';
import { AdminReducer } from './AdminReducer';
import { AppContext } from './AppContext'; 

// 1. Create the Context object
export const AdminContext = createContext(adminInitialState);

// Utility function to get auth headers
const getConfig = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// 2. Create the Provider component
export const AdminProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AdminReducer, adminInitialState);
    const { isAuthenticated, user, logoutUser } = useContext(AppContext);
    
    // --- Admin Action Functions ---

    // 🔑 A1. Fetch All Users
    const fetchAllUsers = async () => {
        dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.get('/api/users', getConfig());
            dispatch({ type: 'SET_ALL_USERS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch users.';
            dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
        }
    };
    
    // 🔑 A2. Update User Role (Admin/Not Admin)
    const updateUserRole = async (userId, isAdmin) => {
        dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.put(`/api/users/${userId}/role`, { isAdmin }, getConfig());
            dispatch({ type: 'UPDATE_USER_ROLE', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update user role.';
            dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
        }
    };

    // 🔑 A3. Delete User
    const deleteUser = async (userId) => {
        dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
        try {
            await axios.delete(`/api/users/${userId}`, getConfig());
            dispatch({ type: 'DELETE_USER', payload: userId });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete user.';
            dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
        }
    };
    
    // 🔑 A4. Fetch All Orders (for Admin)
    const fetchAllOrders = async () => {
        dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.get('/api/orders', getConfig());
            dispatch({ type: 'SET_ALL_ORDERS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch all orders.';
            dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
        }
    };

    // 🔑 A5. Update Order Status (e.g., to Delivered)
    const updateOrderStatus = async (orderId, status) => {
        dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
        try {
            // Check if the order status is actually changing before making the API call
            const orderToUpdate = state.allOrders.find(o => o._id === orderId);
            if (orderToUpdate && orderToUpdate.status === status) {
                 dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
                 return; 
            }

            await axios.put(`/api/orders/${orderId}/status`, { status }, getConfig());
            // Instead of refetching all, dispatch a specific update action if necessary, 
            // but since order list is small, refetching is okay for now, 
            // or we can manually update the state here for better UX.
            fetchAllOrders(); 
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update order status.';
            dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
        } finally {
            // Loading will be cleared by fetchAllOrders on success
            if (state.adminError) { 
                dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
            }
        }
    };
    
    // 🔑 A6. Fetch Admin Products (all products, including inactive)
    const fetchAdminProducts = async () => {
        dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
        try {
            // Assuming your backend has an admin-specific endpoint for all products
            const response = await axios.get('/api/products/admin', getConfig());
            dispatch({ type: 'SET_ADMIN_PRODUCTS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch admin products.';
            dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
        }
    };


    //create product
    const createProduct=async()=>{
        dispatch({type:'SET_ADMIN_LOADING',payload:true})
        try {
            await axios.post('/api/products/',productData,getConfig());
            fetchAdminProducts(); 
            return true;
            
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create product.';
            dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
            return false;
        }
    }

    const updateProduct = async (productId, productData) => {
        dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
        try {
            // Put updated product data
            await axios.put(`/api/products/${productId}`, productData, getConfig());
            // Refetch the entire list (or update the single product in the state)
            fetchAdminProducts(); 
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update product.';
            dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
            return false;
        }
    }



     // 🔑 A9. Delete Product (Soft Delete is common, but we'll use a standard DELETE)
    const deleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch({ type: 'SET_ADMIN_LOADING', payload: true });
            try {
                await axios.delete(`/api/products/${productId}`, getConfig());
                
                // Manually update state by filtering out the deleted product
                dispatch({ 
                    type: 'SET_ADMIN_PRODUCTS', 
                    payload: state.adminProducts.filter(p => p._id !== productId) 
                });
                
            } catch (error) {
                const message = error.response?.data?.message || 'Failed to delete product.';
                dispatch({ type: 'SET_ADMIN_ERROR', payload: message });
            } finally {
                dispatch({ type: 'SET_ADMIN_LOADING', payload: false });
            }
        }
    };






    // Check if the current user is an admin whenever the AppContext user state changes
    React.useEffect(() => {
        // Determine if the logged-in user (from AppContext) has admin privileges
        const isAdminNow = isAuthenticated && (user?.isAdmin || user?.role === 'Admin');

        // Dispatch the status to ensure isUserAdmin in THIS context's state is current
        dispatch({ type: 'SET_ADMIN_STATUS', payload: isAdminNow });

        // Cleanup: Optionally fetch data if becoming admin, or clear data if logging out
        if (isAdminNow) {
             // You can trigger initial data fetching here if you want it loaded immediately
             // on login, but usually it's better to load on the Admin screen itself.
        }

    }, [isAuthenticated, user?.isAdmin, user?.role]); // Dependency on AppContext's state


    return (
        <AdminContext.Provider
            value={{
                ...state,
                // ... existing context values
                fetchAllUsers,
                updateUserRole,
                deleteUser,
                fetchAllOrders,
                updateOrderStatus,
                
                // ⬅️ NEW PRODUCT ACTIONS
                fetchAdminProducts, 
                createProduct,
                updateProduct,
                deleteProduct,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};
