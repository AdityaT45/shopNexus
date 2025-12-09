// client-context/src/context/AppReducer.js

// Helper function to safely get user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem("user"); // Clear corrupted data
    return null;
  }
};

// Initial state will combine Auth and Products states
export const initialState = {
  // Auth State
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),

  // Product State
  products: [],
  productDetails: null,
  topProducts: [],

  // Global UI State (for loading/errors)
  isLoading: false,
  error: null,

  // Cart State
  cart: null,

  // Order State
  lastOrder: null,
  myOrders: [],

  // Category State
  categories: [],
  activeBanners: [],

  // Wishlist State
  wishlist: null,
};

// The central Reducer function
export const AppReducer = (state, action) => {
  switch (action.type) {
    // --- Auth Actions ---
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case "AUTH_ERROR":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: action.payload,
      };
    case "UPDATE_USER":
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
        error: null,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        products: [],
        error: null,
        productDetails: null,
        cart: null,
        myOrders: [],
        lastOrder: null,
        wishlist: null,
      };

    // --- Product Actions ---
    case "SET_PRODUCTS":
      return { ...state, products: action.payload, error: null };
    case "SET_PRODUCT_DETAILS":
      return { ...state, productDetails: action.payload, error: null };
    case "SET_TOP_PRODUCTS":
      return { ...state, topProducts: action.payload, error: null };

    // --- UI/Global Actions ---
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };

    // --- Cart Actions ---
    case "SET_CART":
      // Used for fetching cart, adding item, or removing item (all return the new cart)
      return {
        ...state,
        cart: action.payload,
        error: null,
      };
    case "CLEAR_CART":
      // Used after successful order or logout
      return {
        ...state,
        cart: null,
      };

    // --- Order Actions ---
    case "CREATE_ORDER_SUCCESS":
      return {
        ...state,
        lastOrder: action.payload,
        error: null,
      };
    case "SET_MY_ORDERS":
      return {
        ...state,
        myOrders: action.payload,
        error: null,
      };

    //banner actions can be added here in future
    case "ACTIVE_FETCH_BANNERS_SUCCESS":
      return {
        ...state,
        activeBanners: action.payload,
        error: null,
      };

    // Category Actions
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
        error: null,
      };

    // Wishlist Actions
    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: action.payload,
        error: null,
      };
    case "CLEAR_WISHLIST":
      return {
        ...state,
        wishlist: null,
      };

    default:
      return state;
  }
};
