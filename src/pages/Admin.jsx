import React, { useState, useEffect } from "react";
import Inventory from "../components/Inventory";
import Employee from "../components/Employee";
import Sales from "../components/Sales";
import Config from "../components/Config";
import ProductReport from "../components/ProductReport";
import CouponReport from "../components/CouponReport";
import CustomerReport from "../components/CustomerReport";
import Orders from "../components/Orders.jsx";
import Category from "../components/Category";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("Orders");

  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      {/* Added overflow hidden to prevent overall scrolling */}
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          {[
            "Orders",
            "Product",
            "employees",
            "Product Report",
            "Category",
            "Coupon Report",
            "Customer Report",
            "config",
            "sales",
          ].map((section) => (
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
        {activeSection === "Category" && <Category />}
        {activeSection === "Orders" && <Orders />}
        {activeSection === "employees" && <Employee />}
        {activeSection === "Product Report" && <ProductReport />}
        {activeSection === "Coupon Report" && <CouponReport />}
        {activeSection === "Customer Report" && <CustomerReport />}
        {activeSection === "config" && <Config />}
        {activeSection === "sales" && <Sales />}
      </div>
    </div>
  );
};

export default Admin;
