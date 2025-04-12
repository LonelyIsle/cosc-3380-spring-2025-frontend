import { useState } from "react";

const RestockProductModal = ({ product, onCancel, onConfirm }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(amount, 10);
    if (isNaN(parsed) || parsed === 0) {
      alert("Please enter a non-zero number.");
      return;
    }
    onConfirm(parsed);
  };

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
        <h2 className="text-xl font-semibold mb-4">Restock Product</h2>
        <p className="mb-4">
          Enter quantity to restock <strong>{product.name}</strong>:
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter quantity (e.g. 5 or -5)"
            className="w-full p-2 rounded bg-surface1 text-text"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Confirm Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockProductModal;
