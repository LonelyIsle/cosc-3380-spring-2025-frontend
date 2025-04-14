import React from "react";

const DeleteSaleEventModal = ({ sale, onCancel, onConfirm }) => {
  if (!sale) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(24, 24, 37, 0.7)" }}
      onClick={onCancel}
    >
      <div
        className="bg-surface0 text-text p-6 rounded-2xl shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Delete Sale Event</h2>
        <p className="mb-6">
          Are you sure you want to delete{" "}
          <strong>{sale.title || "this sale event"}</strong>?
        </p>
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition text-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 text-white transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSaleEventModal;
