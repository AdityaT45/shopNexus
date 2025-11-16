// client/src/context/AdminInitialState.js

// Read user data from local storage once for initial state
const adminUser = JSON.parse(localStorage.getItem('user'));

export const adminInitialState = {
    // --- Admin Dashboard Data ---
    users: [],
    allOrders: [],
    adminProducts: [],

    // --- State Management ---
    // Initialize isUserAdmin based on user data, defaulting to false if no user is found
    isUserAdmin: adminUser?.isAdmin || adminUser?.role === 'Admin' || false,
    adminLoading: false,
    adminError: null,
};
