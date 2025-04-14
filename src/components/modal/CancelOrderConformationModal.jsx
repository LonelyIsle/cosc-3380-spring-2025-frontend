import React from "react";

const CancelOrderConfirmationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-xl font-semibold text-green-600 mb-4">
          Order Cancelled
        </h2>
        <p className="text-gray-700 mb-6">
          The order has been successfully cancelled.
        </p>
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200"
          onClick={onClose}
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default CancelOrderConfirmationModal;
