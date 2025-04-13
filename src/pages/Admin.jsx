import React, { useState, useEffect } from "react";
import Inventory from "../components/Inventory";
import Employee from "../components/Employee";
import Sales from "../components/Sales";
import AdminConfig from "../components/AdminConfig";
import AdminProductReport from "../components/AdminProductReport";
import AdminCouponReport from "../components/AdminCouponReport";
import AdminCustomerReport from "../components/AdminCustomerReport";
import CouponManagement from "../components/CouponManagement";
import Orders from "../components/Orders.jsx";
import Category from "../components/Category";
import AdminNotification from "../components/AdminNotification";
import AdminProfile from "../components/AdminProfile";
import AdminCustomer from "../components/AdminCustomer";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const parsedUserData = JSON.parse(userData);

    if (parsedUserData.role === 1) {
      setItems([
        "Notification",
        "Profile",
        "Product",
        "Category",
        "Coupon",
        "Sale Event",
        "Order",
        "Employee",
        "Customer",
        "Product Report",
        "Coupon Report",
        "Customer Report",
        "Config",
      ]);
      setActiveSection("Notifcation");
    } else {
      setItems([
        "Profile",
        "Product",
        "Category",
        "Order",
      ]);
      setActiveSection("Order");
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          {items.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`block w-full text-left px-4 py-2 mb-2 rounded-lg hover:bg-gray-700 ${
                activeSection === section ? "bg-gray-700" : ""
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {" "}
        {/* Added overflow-y-auto to enable vertical scrolling in the main content */}
        {activeSection === "Product" && <Inventory />}
        {activeSection === "Profile" && <AdminProfile />}
        {activeSection === "Category" && <Category />}
        {activeSection === "Order" && <Orders />}
        {activeSection === "Employee" && <Employee />}
        {activeSection === "Coupon" && <CouponManagement />}
        {activeSection === "Product Report" && <AdminProductReport />}
        {activeSection === "Coupon Report" && <AdminCouponReport />}
        {activeSection === "Customer Report" && <AdminCustomerReport />}
        {activeSection === "Config" && <AdminConfig />}
        {activeSection === "Sale Event" && <Sales />}
        {activeSection === "Notification" && <AdminNotification />}
        {activeSection === "Customer" && <AdminCustomer />}
      </div>
    </div>
  );
};

export default Admin;
