import React, { useState, useEffect } from "react";
import axios from "axios";
import CouponModal from "@modal/CouponModal";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("code");
  const [showModal, setShowModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/coupon`;

      const res = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });

      if (res.data && res.data.data && res.data.data.rows) {
        setCoupons(res.data.data.rows);
      } else {
        setCoupons([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch coupons");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentCoupon({
      code: "",
      value: "",
      // Using Unix timestamps
      start_at: Date.now(),
      end_at: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      type: 0,
      description: "",
    });
    setShowModal(true);
  };

  const handleEdit = (coupon) => {
    let displayValue;
    if (coupon.type === 0) {
      // Percentage
      displayValue = (parseFloat(coupon.value) * 100).toString();
    } else {
      // Fixed amount
      displayValue = coupon.value.toString();
    }

    setCurrentCoupon({
      ...coupon,
      value: displayValue,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${import.meta.env.VITE_API_URL}/coupon/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      fetchCoupons();
    } catch (err) {
      setError("Failed to delete coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentCoupon(null);
  };

  const handleSaveCoupon = async (couponData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // DATES ARE UNIX OMG
      const dataToSend = {
        ...couponData,
        start_at:
          typeof couponData.start_at === "number"
            ? couponData.start_at
            : new Date(couponData.start_at).getTime(),
        end_at:
          typeof couponData.end_at === "number"
            ? couponData.end_at
            : new Date(couponData.end_at).getTime(),
      };

      if (couponData.id) {
        // Editing existing coupon
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/coupon/${couponData.id}`,
          dataToSend,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        // Creating new coupon
        await axios.post(`${import.meta.env.VITE_API_URL}/coupon`, dataToSend, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });
      }

      fetchCoupons();
      setShowModal(false);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        "Failed to save coupon: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleDateString("en-US");
    } catch (e) {
      return "Invalid date";
    }
  };

  const getValueDisplay = (value, type) => {
    // For UI display
    const numValue = parseFloat(value);
    if (type === 0) {
      // Percentage
      return `${(numValue * 100).toFixed(0)}%`;
    } else {
      // Fixed amount
      return `$${numValue.toFixed(2)}`;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Coupon Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded p-2"
          >
            <option value="code">Sort by Code</option>
            <option value="created_at">Sort by Created Date</option>
            <option value="updated_at">Sort by Updated Date</option>
          </select>
        </div>

        <button
          onClick={handleAddNew}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Coupon
        </button>
      </div>

      {/* Coupon Modal */}
      {showModal && (
        <CouponModal
          coupon={currentCoupon}
          onClose={handleModalClose}
          onSave={handleSaveCoupon}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">Code</th>
              <th className="px-6 py-3 border-b text-left">Value</th>
              <th className="px-6 py-3 border-b text-left">Type</th>
              <th className="px-6 py-3 border-b text-left">Start Date</th>
              <th className="px-6 py-3 border-b text-left">End Date</th>
              <th className="px-6 py-3 border-b text-left">Description</th>
              <th className="px-6 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && !coupons.length ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons
                .filter(
                  (coupon) =>
                    searchTerm === "" ||
                    coupon.code
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                )
                .sort((a, b) => {
                  if (sortBy === "code") {
                    return a.code.localeCompare(b.code);
                  } else {
                    return new Date(b[sortBy]) - new Date(a[sortBy]);
                  }
                })
                .map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{coupon.code}</td>
                    <td className="px-6 py-4 border-b">
                      {getValueDisplay(coupon.value, coupon.type)}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {coupon.type === 0 ? "Percentage" : "Fixed Amount"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {formatDate(coupon.start_at)}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {formatDate(coupon.end_at)}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {coupon.description || ""}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponManagement;
