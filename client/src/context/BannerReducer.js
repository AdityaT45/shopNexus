const BannerReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_BANNERS_REQUEST":
      return { ...state, loading: true, error: null };

    case "FETCH_BANNERS_SUCCESS":
      return { ...state, loading: false, banners: action.payload };

    case "FETCH_BANNERS_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_BANNER_REQUEST":
      return { ...state, loading: true };

    case "CREATE_BANNER_SUCCESS":
      return { 
        ...state, 
        loading: false, 
        banners: [...state.banners, action.payload] 
      };

    case "CREATE_BANNER_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_BANNER_REQUEST":
      return { ...state, loading: true };

    case "DELETE_BANNER_SUCCESS":
      return {
        ...state,
        loading: false,
        banners: state.banners.filter((b) => b._id !== action.payload),
      };

    case "DELETE_BANNER_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_BANNER_REQUEST":
      return { ...state, loading: true, error: null };

    case "UPDATE_BANNER_SUCCESS":
      return {
        ...state,
        loading: false,
        banners: state.banners.map((b) =>
          b._id === action.payload._id ? action.payload : b
        ),
      };

    case "UPDATE_BANNER_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default BannerReducer;