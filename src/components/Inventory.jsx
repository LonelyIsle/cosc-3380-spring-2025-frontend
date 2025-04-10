import { useShop } from "../context/ShopContext";
import { useState, useEffect } from "react";
import ProductModalUpsert from "./ProductModalUpsert";

const Inventory = () => {
  const { getProductArray } = useShop();
  const inventory = getProductArray();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");

  const openUpsertModal = (productId = null) => {
    setSelectedProductId(productId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
  };

  useEffect(() => {
    // add esc as a valid way to close modal
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    if (modalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen]);



  const filteredInventory = inventory
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (sortKey === "category") {
        return a.category[0]?.localeCompare(b.category[0] || "") || 0;
      }
      return typeof a[sortKey] === "string"
        ? a[sortKey].localeCompare(b[sortKey])
        : a[sortKey] - b[sortKey];
    });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

        <button
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => openUpsertModal(null)}
        >
          + Add New Product
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <select
          onChange={(e) => setSortKey(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="quantity">Quantity</option>
          <option value="price">Price</option>
          <option value="category">Category</option>
        </select>
      </div>
      <table className="w-full border border-black bg-gray-200">
        <thead>
          <tr className="bg-gray-400 text-white">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Restock Threshold</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item, index) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"}
            >
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">{item.threshold || 0}</td>
              <td className="p-2 border">${item.price.toFixed(2)}</td>
              <td className="p-2 border">{item.category?.[0] || "N/A"}</td>
              <td className="p-2 border">
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openUpsertModal(item.id)}
                >
                  Edit Product
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <ProductModalUpsert
          productId={selectedProductId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Inventory;
