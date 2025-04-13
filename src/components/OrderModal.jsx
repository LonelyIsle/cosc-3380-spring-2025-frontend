import React, { useState, useEffect } from "react";

export default function OrderModal({ order, onClose }) {
  if (!order) return null;

  const [editableOrder, setEditableOrder] = useState({ ...order });

  useEffect(() => {
    setEditableOrder({ ...order });
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableOrder((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-md w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Order #{order.id}</h2>

        <div className="space-y-3 text-sm">
          <div>
            <strong>Customer ID:</strong> {order.customer_id ?? "Guest"}
          </div>
          <div>
            <strong>Email:</strong> {order.customer_email}
          </div>
          <div>
            <strong>Shipping Fee:</strong> ${order.shipping_fee?.toFixed(2)}
          </div>
          <div>
            <strong>Tax:</strong> ${(order.total_sale_tax ?? 0).toFixed(2)}
          </div>
          <div>
            <strong>Total (Original):</strong> $
            {(order.total_origin ?? 0).toFixed(2)}
          </div>
          <div>
            <strong>Total (Final):</strong> $
            {(order.total_final ?? 0).toFixed(2)}
          </div>
          <div>
            <strong>Coupon Used:</strong> {order.coupon_value ?? 0}
          </div>
          <div>
            <strong>Tracking:</strong>
            <input
              name="tracking"
              value={editableOrder.tracking ?? ""}
              onChange={handleChange}
              className="ml-2 border p-1 rounded"
            />
          </div>
          <div>
            <strong>Status:</strong>
            <select
              name="status"
              value={editableOrder.status ?? ""}
              onChange={handleChange}
              className="ml-2 border p-1 rounded"
            >
              <option value="0">Pending</option>
              <option value="1">Processing</option>
              <option value="2">Shipped</option>
              <option value="3">Delivered</option>
              <option value="4">Cancelled</option>
            </select>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Shipping Address</h3>
            <div>{order.shipping_address_1}</div>
            <div>{order.shipping_address_2}</div>
            <div>
              {order.shipping_address_city}, {order.shipping_address_state}{" "}
              {order.shipping_address_zip}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Billing Address</h3>
            <div>{order.billing_address_1}</div>
            <div>{order.billing_address_2}</div>
            <div>
              {order.billing_address_city}, {order.billing_address_state}{" "}
              {order.billing_address_zip}
            </div>
          </div>

          <div className="mt-4 text-gray-500 text-xs">
            Created at: {new Date(order.created_at).toLocaleString()}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={async () => {
              await fetch(
                `${import.meta.env.VITE_API_URL}/order/${editableOrder.id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    ...editableOrder,
                    status: Number(editableOrder.status),
                  }),
                },
              );
              onClose();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            onClick={async () => {
              await fetch(
                `${import.meta.env.VITE_API_URL}/order/${editableOrder.id}/cancel`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                  },
                  credentials: "include",
                },
              );
              onClose();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}
