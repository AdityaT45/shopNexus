// client/src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Import Components
import AdminHeader from "./component/AdminHeader";
import UserHeader from "./component/UserHeader";
import Footer from "./component/Footer";
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
import WishlistScreen from "./pages/WishlistScreen";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUserListScreen from "./pages/Admin/AdminUserListScreen";
import AdminOrderListScreen from "./pages/Admin/AdminOrderListScreen";
import AdminProductListScreen from "./pages/Admin/AdminProductListScreen";
import AdminProductEditScreen from "./pages/Admin/AdminProductEditScreen";
import AdminRoute from "./component/Admin/AdminRoute";
import AdminLayout from "./component/Admin/AdminLayout";
import { AppContext } from "./context/AppContext";
import AdminBannerListScreen from "./pages/Admin/AdminBannerListScreen";
import AdminBannerEditScreen from "./pages/Admin/AdminBannerEditScreen";
import AdminCategoryListScreen from "./pages/Admin/AdminCategoryListScreen";
import AdminAttributeScreen from "./pages/Admin/AdminAttributeScreen";
import AdminDiscountScreen from "./pages/Admin/AdminDiscountScreen";
import AdminFooterScreen from "./pages/Admin/AdminFooterScreen";
import CategoriesScreen from "./pages/CategoriesScreen";
import ProductsListScreen from "./pages/ProductsListScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SuperAdminRoute from "./component/SuperAdmin/SuperAdminRoute";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import SuperAdminAdminListScreen from "./pages/SuperAdmin/SuperAdminAdminListScreen";
import SuperAdminUserListScreen from "./pages/SuperAdmin/SuperAdminUserListScreen";
import SuperAdminOrderListScreen from "./pages/SuperAdmin/SuperAdminOrderListScreen";
import SuperAdminProductListScreen from "./pages/SuperAdmin/SuperAdminProductListScreen";
import SuperAdminLayout from "./component/SuperAdmin/SuperAdminLayout";
import { SuperAdminProvider } from "./context/SuperAdminContext";

// Component to conditionally render header based on route
function ConditionalHeader() {
  const location = useLocation();
  const { user } = useContext(AppContext);
  const isAdmin = user?.isAdmin || user?.role === 'Admin';
  const isSuperAdmin = user?.role === 'Super Admin';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSuperAdminRoute = location.pathname.startsWith('/superadmin');
  
  // Don't show header on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Show AdminHeader for super admin routes
  if (isSuperAdminRoute && isSuperAdmin) {
    return <AdminHeader />;
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
    <SuperAdminProvider>
      <ConditionalHeader />
      <main className="py-3">
        <div className="container-fluid">
          <Routes>
            {/* Public Routes - No Header on login/register */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes - Protected from Admin */}
            <Route element={<UserRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/" element={<UserDashboard />} />
              <Route path="/products" element={<ProductsListScreen />} />
              <Route path="/products/:id" element={<ProductScreen />} />
              <Route path="/categories" element={<CategoriesScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/checkout" element={<CheckoutScreen />} />
              <Route path="/myorders" element={<MyOrdersScreen />} />
              <Route path="/wishlist" element={<WishlistScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Route>

            {/* Super Admin Routes - Protected from Users and Admins */}
            <Route element={<SuperAdminRoute />}>
              <Route element={<SuperAdminLayout />}>
                <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
                <Route path="/superadmin/admins" element={<SuperAdminAdminListScreen />} />
                <Route path="/superadmin/users" element={<SuperAdminUserListScreen />} />
                <Route path="/superadmin/orders" element={<SuperAdminOrderListScreen />} />
                <Route path="/superadmin/products" element={<SuperAdminProductListScreen />} />
              </Route>
            </Route>

            {/* Admin Routes - Protected from Users */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUserListScreen />} />
                <Route path="/admin/orders" element={<AdminOrderListScreen />} />
                <Route path="/admin/products" element={<AdminProductListScreen />}/>
                <Route path="/admin/categories" element={<AdminCategoryListScreen />}/>
                <Route path="/admin/attributes" element={<AdminAttributeScreen />}/>
                <Route path="/admin/discounts" element={<AdminDiscountScreen />}/>
                <Route path="/admin/footer" element={<AdminFooterScreen />}/>
                <Route path="/admin/banners" element={<AdminBannerListScreen />}/>
                <Route path="/admin/banner/create" element={<AdminBannerEditScreen />}/>
                <Route path="/admin/banner/:id" element={<AdminBannerEditScreen />} />
                <Route path="/admin/product/new" element={<AdminProductEditScreen />}/>
                <Route path="/admin/product/:productId/edit" element={<AdminProductEditScreen />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </main>
      <Footer />
    </SuperAdminProvider>
  );
}

export default App;
