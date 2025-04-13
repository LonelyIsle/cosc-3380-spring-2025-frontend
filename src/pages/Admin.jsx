// pages/Admin.jsx
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Admin = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const parsedUserData = JSON.parse(userData);

    if (parsedUserData?.role === 1) {
      setItems([
        "notification",
        "profile",
        "product",
        "category",
        "coupon",
        "sale-event",
        "order",
        "employee",
        "customer",
        "product-report",
        "coupon-report",
        "customer-report",
        "config",
      ]);
    } else {
      setItems(["profile", "product", "category", "order"]);
    }
  }, []);

  const toLabel = (slug) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          {items.map((section) => (
            <NavLink
              key={section}
              to={`/admin/${section}`}
              className={({ isActive }) =>
                `block w-full text-left px-4 py-2 mb-2 rounded-lg hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {toLabel(section)}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
