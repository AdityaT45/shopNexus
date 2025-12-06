// BannerContext.js

import { createContext, useReducer } from "react";
import axios from "axios";
import BannerInitialState from "./BannerInitialState";
import BannerReducer from "./BannerReducer";

export const BannerContext = createContext();

// Get token from localStorage
const getConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const BannerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BannerReducer, BannerInitialState);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      dispatch({ type: "FETCH_BANNERS_REQUEST" });

      const { data } = await axios.get("/api/banners", getConfig());
      dispatch({ type: "FETCH_BANNERS_SUCCESS", payload: data });

    } catch (error) {
      dispatch({
        type: "FETCH_BANNERS_FAIL",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Create new banner
  const createBanner = async (bannerData) => {
    try {
      dispatch({ type: "CREATE_BANNER_REQUEST" });

      const { data } = await axios.post("/api/banners", bannerData, getConfig());
      // The API returns { message: "...", banner: {...} }
      dispatch({ type: "CREATE_BANNER_SUCCESS", payload: data.banner || data });

    } catch (error) {
      dispatch({
        type: "CREATE_BANNER_FAIL",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Update banner
  const updateBanner = async (id, bannerData) => {
    try {
      dispatch({ type: "UPDATE_BANNER_REQUEST" });
      await axios.put(`/api/banners/${id}`, bannerData, getConfig());
      // Refresh the banners list to get the updated data
      await fetchBanners();
      
    } catch (error) {
      dispatch({
        type: "UPDATE_BANNER_FAIL",
        payload: error.response?.data?.message || error.message,
      });
      throw error; // Re-throw so the caller can handle it
    }
  };

  // Delete banner
  const deleteBanner = async (id) => {
    try {
      dispatch({ type: "DELETE_BANNER_REQUEST" });

      await axios.delete(`/api/banners/${id}`, getConfig());
      dispatch({ type: "DELETE_BANNER_SUCCESS", payload: id });

    } catch (error) {
      dispatch({
        type: "DELETE_BANNER_FAIL",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <BannerContext.Provider
      value={{
        banners: state.banners,
        loading: state.loading,
        error: state.error,
        fetchBanners,
        createBanner,
        deleteBanner,
        updateBanner
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};
