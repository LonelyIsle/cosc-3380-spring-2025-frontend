import { Route, Navigate } from "react-router-dom";
import Admin from "@admin/Admin";
import AdminNotification from "@admin/AdminNotification";
import AdminProfile from "@admin/AdminProfile";
import Inventory from "@admin/Inventory";
import Category from "@admin/Category";
import Orders from "@admin/Orders";
import Employee from "@admin/Employee";
import CouponManagement from "@admin/CouponManagement";
import Sales from "@admin/Sales";
import AdminCustomer from "@admin/AdminCustomer";
import AdminProductReport from "@admin/AdminProductReport";
import AdminCouponReport from "@admin/AdminCouponReport";
import AdminCustomerReport from "@admin/AdminCustomerReport";
import AdminConfig from "@admin/AdminConfig";
import Adminlogin from "@admin/Adminlogin";

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
