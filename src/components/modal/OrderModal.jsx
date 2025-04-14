import React, { useState, useEffect } from "react";
import CancelOrderModal from "src/components/modal/CancelOrderModal";

export default function OrderModal({ order, onClose, onSave }) {
  if (!order) return null;

  const [editableOrder, setEditableOrder] = useState({ ...order });
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    setEditableOrder({ ...order });
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableOrder((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded shadow-md w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] relative">
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
              className="ml-2 border border-gray-700 bg-gray-800 text-white p-2 rounded"
            />
          </div>
          <div>
            <strong>Status:</strong>{" "}
            {editableOrder.status === 0
              ? "Pending"
              : editableOrder.status === 1
                ? "Processing"
                : editableOrder.status === 2
                  ? "Shipped"
                  : editableOrder.status === 3
                    ? "Delivered"
                    : editableOrder.status === -1
                      ? "Cancelled"
                      : "Unknown"}
          </div>
          {editableOrder.status === 1 && (
            <div className="mt-2">
              <button
                onClick={() =>
                  setEditableOrder((prev) => ({
                    ...prev,
                    status: 2,
                  }))
                }
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Mark as Shipped
              </button>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-semibold text-lg text-gray-300">
              Shipping Address
            </h3>
            <div>{order.shipping_address_1}</div>
            <div>{order.shipping_address_2}</div>
            <div>
              {order.shipping_address_city}, {order.shipping_address_state}{" "}
              {order.shipping_address_zip}
            </div>
          </div>

          {order.items?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-lg text-gray-300">
                Products Ordered
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-3 rounded shadow text-white"
                  >
                    <div>
                      <div className="font-semibold">{item.product.name}</div>
                      <div className="text-sm text-gray-400">
                        Price: ${item.price?.toFixed(2) ?? "0.00"}
                      </div>
                      <div className="text-sm text-gray-400">
                        Quantity: {item.quantity ?? 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-gray-500 text-xs">
            Created at: {new Date(order.created_at).toLocaleString()}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
          >
            Close
          </button>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/order/${editableOrder.id}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                      },
                      credentials: "include",
                      body: JSON.stringify(editableOrder),
                    },
                  );

                  if (!response.ok) {
                    throw new Error("Failed to update order");
                  }

                  const updatedOrder = await response.json();
                  setEditableOrder(updatedOrder.data);
                  console.log("Updated order data:", updatedOrder.data);
                  if (typeof onSave === "function") {
                    console.log("Calling onSave...");
                    onSave(updatedOrder.data);
                  }
                  onClose();
                } catch (error) {
                  console.error("Error saving order:", error);
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </div>

        {showCancelModal && (
          <CancelOrderModal
            order={order}
            onCancel={() => setShowCancelModal(false)}
            onConfirm={async () => {
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
              setShowCancelModal(false);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
}
