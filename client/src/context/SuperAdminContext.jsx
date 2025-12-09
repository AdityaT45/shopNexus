// client/src/context/SuperAdminContext.jsx
import React, { createContext, useReducer, useCallback } from 'react';
import axios from 'axios';

const superAdminInitialState = {
    stats: null,
    admins: [],
    users: [],
    orders: [],
    products: [],
    superAdminLoading: false,
    superAdminError: null,
};

export const SuperAdminContext = createContext(superAdminInitialState);

const SuperAdminReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SUPER_ADMIN_LOADING':
            return { ...state, superAdminLoading: action.payload };
        case 'SET_SUPER_ADMIN_ERROR':
            return { ...state, superAdminError: action.payload, superAdminLoading: false };
        case 'SET_DASHBOARD_STATS':
            return { ...state, stats: action.payload, superAdminError: null, superAdminLoading: false };
        case 'SET_ADMINS':
            return { ...state, admins: action.payload, superAdminError: null, superAdminLoading: false };
        case 'SET_USERS':
            return { ...state, users: action.payload, superAdminError: null, superAdminLoading: false };
        case 'SET_ORDERS':
            return { ...state, orders: action.payload, superAdminError: null, superAdminLoading: false };
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload, superAdminError: null, superAdminLoading: false };
        case 'ADD_ADMIN':
            return { ...state, admins: [...state.admins, action.payload], superAdminError: null, superAdminLoading: false };
        case 'REMOVE_ADMIN':
            return { 
                ...state, 
                admins: state.admins.filter(admin => admin.userId !== action.payload && admin._id !== action.payload),
                superAdminError: null, 
                superAdminLoading: false 
            };
        default:
            return state;
    }
};

export const SuperAdminProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SuperAdminReducer, superAdminInitialState);

    const getConfig = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const fetchDashboardStats = useCallback(async () => {
        dispatch({ type: 'SET_SUPER_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.get('/api/superadmin/dashboard', getConfig());
            dispatch({ type: 'SET_DASHBOARD_STATS', payload: response.data.stats });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch dashboard stats.';
            dispatch({ type: 'SET_SUPER_ADMIN_ERROR', payload: message });
        }
    }, []);

    const fetchAdmins = useCallback(async () => {
        dispatch({ type: 'SET_SUPER_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.get('/api/superadmin/admins', getConfig());
            dispatch({ type: 'SET_ADMINS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch admins.';
            dispatch({ type: 'SET_SUPER_ADMIN_ERROR', payload: message });
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        dispatch({ type: 'SET_SUPER_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.get('/api/superadmin/users', getConfig());
            dispatch({ type: 'SET_USERS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch users.';
            dispatch({ type: 'SET_SUPER_ADMIN_ERROR', payload: message });
        }
    }, []);

    const promoteToAdmin = async (userId) => {
        dispatch({ type: 'SET_SUPER_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.post('/api/superadmin/admins', { userId }, getConfig());
            dispatch({ type: 'ADD_ADMIN', payload: response.data.user });
            fetchAdmins(); // Refresh list
            fetchUsers(); // Refresh users list
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to promote user to admin.';
            dispatch({ type: 'SET_SUPER_ADMIN_ERROR', payload: message });
            return false;
        }
    };

    const demoteFromAdmin = async (adminId) => {
        dispatch({ type: 'SET_SUPER_ADMIN_LOADING', payload: true });
        try {
            await axios.delete(`/api/superadmin/admins/${adminId}`, getConfig());
            dispatch({ type: 'REMOVE_ADMIN', payload: adminId });
            fetchAdmins(); // Refresh list
            fetchUsers(); // Refresh users list
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to demote admin.';
            dispatch({ type: 'SET_SUPER_ADMIN_ERROR', payload: message });
            return false;
        }
    };

    const fetchOrders = useCallback(async () => {
        dispatch({ type: 'SET_SUPER_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.get('/api/superadmin/orders', getConfig());
            dispatch({ type: 'SET_ORDERS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch orders.';
            dispatch({ type: 'SET_SUPER_ADMIN_ERROR', payload: message });
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        dispatch({ type: 'SET_SUPER_ADMIN_LOADING', payload: true });
        try {
            const response = await axios.get('/api/superadmin/products', getConfig());
            dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch products.';
            dispatch({ type: 'SET_SUPER_ADMIN_ERROR', payload: message });
        }
    }, []);

    return (
        <SuperAdminContext.Provider
            value={{
                ...state,
                fetchDashboardStats,
                fetchAdmins,
                fetchUsers,
                fetchOrders,
                fetchProducts,
                promoteToAdmin,
                demoteFromAdmin,
            }}
        >
            {children}
        </SuperAdminContext.Provider>
    );
};

