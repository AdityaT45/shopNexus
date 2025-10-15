// client-context/src/context/AppReducer.js

// Initial state will combine Auth and Products states
export const initialState = {
  // Auth State
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!JSON.parse(localStorage.getItem("user")),

  // Product State
  products: [],
  productDetails: null,

  // Global UI State (for loading/errors)
  isLoading: false,
  error: null,

  // Cart State
  cart: null,

  // Order State
    lastOrder: null, 
    myOrders: [],  
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
    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        products: [],
        error: null,
        productDetails: null,
      };

    // --- Product Actions ---
    case "SET_PRODUCTS":
      return { ...state, products: action.payload, error: null };
    case "SET_PRODUCT_DETAILS":
      return { ...state, productDetails: action.payload, error: null };

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

    default:
      return state;
  }
};
