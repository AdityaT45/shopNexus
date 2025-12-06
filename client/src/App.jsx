// client/src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Import Components
import AdminHeader from "./component/AdminHeader";
import UserHeader from "./component/UserHeader";
import UserRoute from "./component/UserRoute";

// Import Pages (will be created in upcoming steps)
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductScreen from "./pages/ProductScreen";
import CartScreen from "./pages/CartScreen";
import CheckoutScreen from "./pages/CheckoutScreen";
import MyOrdersScreen from "./pages/MyOrdersScreen";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUserListScreen from "./pages/Admin/AdminUserListScreen";
import AdminOrderListScreen from "./pages/Admin/AdminOrderListScreen";
import AdminProductListScreen from "./pages/Admin/AdminProductListScreen";
import AdminProductEditScreen from "./pages/Admin/AdminProductEditScreen";
import AdminRoute from "./component/Admin/AdminRoute";
import { AppContext } from "./context/AppContext";
import AdminBannerListScreen from "./pages/Admin/AdminBannerListScreen";
import AdminBannerEditScreen from "./pages/Admin/AdminBannerEditScreen";
import AdminCategoryListScreen from "./pages/Admin/AdminCategoryListScreen";
import CategoriesScreen from "./pages/CategoriesScreen";
import ProfileScreen from "./pages/ProfileScreen";

// Component to conditionally render header based on route
function ConditionalHeader() {
  const location = useLocation();
  const { user } = useContext(AppContext);
  const isAdmin = user?.isAdmin || user?.role === 'Admin';
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't show header on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Show AdminHeader for admin routes
  if (isAdminRoute && isAdmin) {
    return <AdminHeader />;
  }

  // Show UserHeader for all other routes
  return <UserHeader />;
}

function App() {
  return (
    <>
      <ConditionalHeader />
      <main className="py-3">
        <div className="container">
          <Routes>
            {/* Public Routes - No Header on login/register */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes - Protected from Admin */}
            <Route element={<UserRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/" element={<UserDashboard />} />
              <Route path="/products/:id" element={<ProductScreen />} />
              <Route path="/categories" element={<CategoriesScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/checkout" element={<CheckoutScreen />} />
              <Route path="/myorders" element={<MyOrdersScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Route>

            {/* Admin Routes - Protected from Users */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUserListScreen />} />
              <Route path="/admin/orders" element={<AdminOrderListScreen />} />
              <Route path="/admin/products" element={<AdminProductListScreen />}/>
              <Route path="/admin/categories" element={<AdminCategoryListScreen />}/>
              <Route path="/admin/banners" element={<AdminBannerListScreen />}/>
              <Route path="/admin/banner/create" element={<AdminBannerEditScreen />}/>
              <Route path="/admin/banner/:id" element={<AdminBannerEditScreen />} />
              <Route path="/admin/product/new" element={<AdminProductEditScreen />}/>
              <Route path="/admin/product/:productId/edit" element={<AdminProductEditScreen />} />
            </Route>
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;
