// App.jsx
import { Navbar, Footer, SalesBanner } from "./components";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import {
  Cart,
  Checkout,
  LandingPage,
  Login,
  Product,
  Profile,
  Register,
  Shop,
} from "./pages";
import { useState, useEffect } from "react";
import Admin from "./pages/Admin";
import { Adminlogin } from "./pages";
import Fpassword from "./pages/ForgotPassword";
import Subscription from "./pages/Subscription";

// Admin panel components
import Inventory from "./components/Inventory";
import Employee from "./components/Employee";
import Sales from "./components/Sales";
import AdminConfig from "./components/AdminConfig";
import AdminProductReport from "./components/AdminProductReport";
import AdminCouponReport from "./components/AdminCouponReport";
import AdminCustomerReport from "./components/AdminCustomerReport";
import CouponManagement from "./components/CouponManagement";
import Orders from "./components/Orders";
import Category from "./components/Category";
import AdminNotification from "./components/AdminNotification";
import AdminProfile from "./components/AdminProfile";
import AdminCustomer from "./components/AdminCustomer";

function RedirectToHome() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);
  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <div className="bg-flamingo flex flex-col justify-between min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <SalesBanner />
      <Routes>
        {/* Redirect unknown routes */}
        <Route path="*" element={<RedirectToHome />} />

        {/* User routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fpassword" element={<Fpassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/subscription" element={<Subscription />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<Adminlogin />} />

        {/* Admin panel (layout with nested routes) */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="notification" replace />} />
          <Route path="notification" element={<AdminNotification />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="product" element={<Inventory />} />
          <Route path="category" element={<Category />} />
          <Route path="order" element={<Orders />} />
          <Route path="employee" element={<Employee />} />
          <Route path="coupon" element={<CouponManagement />} />
          <Route path="sale-event" element={<Sales />} />
          <Route path="customer" element={<AdminCustomer />} />
          <Route path="product-report" element={<AdminProductReport />} />
          <Route path="coupon-report" element={<AdminCouponReport />} />
          <Route path="customer-report" element={<AdminCustomerReport />} />
          <Route path="config" element={<AdminConfig />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
