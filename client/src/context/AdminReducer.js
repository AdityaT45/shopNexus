// client/src/context/AdminReducer.js
import { adminInitialState } from './AdminInitialState';

export const AdminReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ADMIN_LOADING':
            return {
                ...state,
                adminLoading: action.payload,
                adminError: null, // Clear error when starting a new operation
            };

        case 'SET_ADMIN_ERROR':
            return {
                ...state,
                adminError: action.payload,
                adminLoading: false,
            };
            
        // NEW: Action to explicitly set the admin status based on AppContext changes
        case 'SET_ADMIN_STATUS':
            return {
                ...state,
                isUserAdmin: action.payload,
                // Ensure state is cleared if status changes from Admin to User
                ...(action.payload === false ? { 
                    users: [],
                    allOrders: [],
                    adminProducts: [],
                } : {})
            };

        case 'SET_ALL_USERS':
            return {
                ...state,
                users: action.payload,
                adminLoading: false,
                adminError: null,
            };
            
        case 'SET_ALL_ORDERS':
            return {
                ...state,
                allOrders: action.payload,
                adminLoading: false,
                adminError: null,
            };
            
        case 'SET_ADMIN_PRODUCTS':
            return {
                ...state,
                adminProducts: action.payload,
                adminLoading: false,
                adminError: null,
            };
            
        case 'UPDATE_USER_ROLE':
            return {
                ...state,
                users: state.users.map(user => 
                    user._id === action.payload._id ? action.payload : user
                ),
                adminLoading: false,
                adminError: null,
            };
            
        case 'DELETE_USER':
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.payload),
                adminLoading: false,
                adminError: null,
            };

        case 'ADMIN_LOGOUT':
             // Reset admin-specific state upon logout
            return {
                ...adminInitialState,
                isUserAdmin: false,
            };

        default:
            return state;
    }
};
