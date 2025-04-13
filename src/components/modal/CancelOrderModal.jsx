import React, { useState } from "react";

const CancelOrderModal = ({ order, onCancel, onConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onCancel}>
        <div className="bg-gray-900 text-white rounded p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-bold text-green-400 mb-4">Order Cancelled</h2>
          <p className="text-gray-300 mb-6">The order has been successfully cancelled.</p>
          <div className="flex justify-center">
            <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 text-white rounded p-6 w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-200 mb-4">Cancel Order</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to cancel{" "}
          <span className="font-semibold">
            {order.customer_email || `Order #${order.id}`}
          </span>
          ?
        </p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
          >
            Go Back
          </button>
          <button
            onClick={async () => {
              try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_URL}/order/${order.id}/cancel`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: localStorage.getItem("token"),
                    },
                    credentials: "include",
                  }
                );

                if (!response.ok) {
                  throw new Error("Failed to cancel order");
                }

                setConfirmed(true);

                if (typeof onConfirm === "function") {
                  onConfirm(); // refresh and update list
                }
                if (typeof onCancel === "function") {
                  onCancel(); // close the modal
                }
              } catch (error) {
                console.error("Cancel order failed:", error);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded z-50"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;