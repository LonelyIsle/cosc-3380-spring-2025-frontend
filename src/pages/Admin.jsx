import React, { useState, useEffect } from "react";
import Inventory from "../components/Inventory";
import Employee from "../components/Employee";
import Sales from "../components/Sales";
import Config from "../components/Config";
import ProductReport from "../components/ProductReport";
import CouponReport from "../components/CouponReport";
import CustomerReport from "../components/CustomerReport";

const mockOrders = [
  { id: 101, customer: "Customer A", tracking_info: "Shipped", employeeId: 2 },
  {
    id: 102,
    customer: "Customer B",
    tracking_info: "Processing",
    employeeId: 1,
  },
  {
    id: 103,
    customer: "Customer C",
    tracking_info: "Delivered",
    employeeId: 4,
  },
  { id: 104, customer: "Customer D", tracking_info: "Pending", employeeId: 1 },
];

const Admin = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      {/* Added overflow hidden to prevent overall scrolling */}
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          {["orders", "Product", "employees", "Product Report", "Coupon Report", "Customer Report", "Config", "sales"].map(
            (section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`block w-full text-left px-4 py-2 mb-2 rounded-lg hover:bg-gray-700 ${
                  activeSection === section ? "bg-gray-700" : ""
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            )
          )}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {" "}
        {/* Added overflow-y-auto to enable vertical scrolling in the main content */}
        {activeSection === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Management</h2>
            <div className="overflow-x-auto">
              {" "}
              {/* Added overflow-x-auto to enable horizontal scrolling if needed */}
              <table className="min-w-full border border-black bg-gray-100 text-center">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="py-2 px-4 border border-black">ID</th>
                    <th className="py-2 px-4 border border-black">Customer</th>
                    <th className="py-2 px-4 border border-black">
                      Tracking Info
                    </th>
                    <th className="py-2 px-4 border border-black">
                      Employee ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"} text-center`}
                    >
                      <td className="py-2 px-4 border border-black">
                        {order.id}
                      </td>
                      <td className="py-2 px-4 border border-black">
                        {order.customer}
                      </td>
                      <td className="py-2 px-4 border border-black">
                        {order.tracking_info}
                      </td>
                      <td className="py-2 px-4 border border-black">
                        {order.employeeId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeSection === "Product" && <Inventory />}
        {activeSection === "employees" && <Employee />}
        {activeSection === "Product Report" && <ProductReport />}
        {activeSection === "Coupon Report" && <CouponReport />}
        {activeSection === "Customer Report" && <CustomerReport />}
        {activeSection === "Config" && <Config />}
        {activeSection === "sales" && <Sales />}
      </div>
    </div>
  );
};

export default Admin;