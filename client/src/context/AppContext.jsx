import React, { createContext, useReducer, useCallback } from 'react';
import { AppReducer, initialState } from './AppReducer';
import axios from 'axios';

// 1. Create the Context object
export const AppContext = createContext(initialState);


const getConfig = () => {
    // ⚠️ NOTE: Assuming 'user' data (which contains token) is stored in localStorage after login
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// 2. Create the Provider component
export const AppProvider = ({ children }) => {
    // useReducer manages the state updates, similar to Redux
    const [state, dispatch] = useReducer(AppReducer, initialState);

    // --- Action Functions (Replaces Redux Thunks) ---

    // 🔑 Function 1: Handle User Login/Register
    const loginUser = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.post('/api/auth/login', userData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            dispatch({ type: 'AUTH_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };


    const registerUser = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.post('/api/auth/register', userData);
            dispatch({ type: 'REGISTER_SUCCESS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };


    // 🔑 Function 2: Handle User Logout
    const logoutUser = () => {
        try {
            // Clear localStorage
            localStorage.removeItem('user');
            // Dispatch logout action to clear all state
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if there's an error, still try to clear the state
            dispatch({ type: 'LOGOUT' });
        }
    };

    // 🔑 Function 3: Fetch Public Products
    const fetchProducts = async (query = '') => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.get(`/api/products/public${query}`);
            dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch products';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };


    const fetchProductDetails = async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.get(`/api/products/public/${id}`);
            dispatch({ type: 'SET_PRODUCT_DETAILS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Product not found.';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };
 

    // --- Action Function 4: Add/Update Cart ---
    const updateCart = async (itemData) => {
        // itemData is { productId, quantity }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.post('/api/carts', itemData, getConfig());
            dispatch({ type: 'SET_CART', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update cart.';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // --- Action Function 5: Fetch Cart ---
    const fetchCart = useCallback(async () => {
        if (!state.isAuthenticated) return;
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.get('/api/carts', getConfig());
            dispatch({ type: 'SET_CART', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch cart.';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.isAuthenticated]);

    // --- Action Function 6: Remove Item from Cart ---
    const removeItemFromCart = async (productId) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            // Backend route: DELETE /api/carts/:productId
            const response = await axios.delete(`/api/carts/${productId}`, getConfig());
            dispatch({ type: 'SET_CART', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove item.';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };


    // ORDER ACTIONS
    const createNewOrder = async (orderData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.post('/api/orders', orderData, getConfig());
            
            dispatch({ type: 'CREATE_ORDER_SUCCESS', payload: response.data });
            dispatch({ type: 'CLEAR_CART' }); 

            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Order creation failed.';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };


    const fetchMyOrders = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.get('/api/orders/myorders', getConfig());
            dispatch({ type: 'SET_MY_ORDERS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch orders.';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };


    return (
        <AppContext.Provider
            value={{
                // Expose state (read-only)
                ...state,
                
                // Expose actions (functions that change state)
                loginUser,
                logoutUser,
                registerUser,
                fetchProducts,
                fetchProductDetails,
                updateCart,
                fetchCart,
                removeItemFromCart,
                createNewOrder,
                fetchMyOrders,

            }}
        >
            {children}
        </AppContext.Provider>
    );
};
