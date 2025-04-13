import React, { useState, useEffect } from "react";

const CouponModal = ({ coupon, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    value: "",
    start_at: Date.now(),
    end_at: Date.now() + 30 * 24 * 60 * 60 * 1000, // default at 30 days from now
    type: 0,
    description: "",
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        ...coupon,
        start_at: coupon.start_at,
        end_at: coupon.end_at,
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "value") {
      const numericValue = value.replace(/[^\d.]/g, "");
      const isValidNumber = /^\d*\.?\d*$/.test(numericValue);

      if (isValidNumber || numericValue === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else if (name === "type") {
      const typeValue = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        type: typeValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const dateValue = new Date(value).getTime();

    setFormData((prev) => ({
      ...prev,
      [name]: dateValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const couponToSubmit = { ...formData };

    const numericValue = parseFloat(couponToSubmit.value) || 0;

    if (couponToSubmit.type === 0) {
      // Percentage
      couponToSubmit.value = numericValue / 100;
    } else {
      // Fixed amount
      couponToSubmit.value = numericValue;
    }

    if (typeof couponToSubmit.start_at === "string") {
      couponToSubmit.start_at = new Date(couponToSubmit.start_at).getTime();
    }

    if (typeof couponToSubmit.end_at === "string") {
      couponToSubmit.end_at = new Date(couponToSubmit.end_at).getTime();
    }

    onSave(couponToSubmit);
  };

  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toISOString().substring(0, 10); // YYYY-MM-DD format
    } catch (e) {
      return "";
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(24, 24, 37, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="bg-surface0 text-text p-6 rounded-2xl shadow-lg w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {formData.id ? "Update Coupon" : "Add New Coupon"}
        </h2>
        {loading ? (
          <p className="text-overlay1">Processing...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex justify-center items-center gap-4">
              <label className="font-semibold bl">Code</label>
              <input
                type="text"
                name="code"
                placeholder="Coupon Code"
                value={formData.code}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />
              <label className="font-semibold bl">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              >
                <option value={0}>Percentage</option>
                <option value={1}>Fixed Amount</option>
              </select>
            </div>

            <div className="flex justify-center items-center gap-4">
              <label className="font-semibold bl">
                {formData.type === 0 ? "Value (%)" : "Value ($)"}
              </label>
              <input
                type="text"
                name="value"
                placeholder={formData.type === 0 ? "10 for 10%" : "10 for $10"}
                value={formData.value}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />

              <label className="font-semibold bl">Description</label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
              />
            </div>

            <div className="flex justify-center items-center gap-4">
              <label className="font-semibold bl">Start Date</label>
              <input
                type="date"
                name="start_at"
                value={formatDateForInput(formData.start_at)}
                onChange={handleDateChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />

              <label className="font-semibold bl">End Date</label>
              <input
                type="date"
                name="end_at"
                value={formatDateForInput(formData.end_at)}
                onChange={handleDateChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green rounded hover:bg-teal text-black transition"
              >
                {formData.id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CouponModal;
