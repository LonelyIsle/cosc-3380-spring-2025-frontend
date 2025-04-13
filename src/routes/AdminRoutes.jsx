import { Route, Navigate } from "react-router-dom";
import Admin from "../pages/Admin";
import AdminNotification from "../components/AdminNotification";
import AdminProfile from "../components/AdminProfile";
import Inventory from "../components/Inventory";
import Category from "../components/Category";
import Orders from "../components/Orders";
import Employee from "../components/Employee";
import CouponManagement from "../components/CouponManagement";
import Sales from "../components/Sales";
import AdminCustomer from "../components/AdminCustomer";
import AdminProductReport from "../components/AdminProductReport";
import AdminCouponReport from "../components/AdminCouponReport";
import AdminCustomerReport from "../components/AdminCustomerReport";
import AdminConfig from "../components/AdminConfig";
import Adminlogin from "../pages/Adminlogin";

const AdminRoutes = () => (
  <>
    <Route path="/admin/login" element={<Adminlogin />} />
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
  </>
);

export default AdminRoutes;
