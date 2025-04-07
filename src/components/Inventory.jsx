import { useShop } from "../context/ShopContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const { getProductArray } = useShop();
  const inventory = getProductArray();
  const [restockQuantities, setRestockQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initialRestockQuantities = {};
    inventory.forEach((item) => {
      initialRestockQuantities[item.id] = 0;
    });
    setRestockQuantities(initialRestockQuantities);
  }, [inventory]);

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
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
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
            <th className="p-2 border">Restock</th>
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
              <td className="p-2 border">{item.restock_threshold ?? "N/A"}</td>
              <td className="p-2 border">${item.price.toFixed(2)}</td>
              <td className="p-2 border">{item.category?.[0] || "N/A"}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  min="0"
                  value={restockQuantities[item.id] || 0}
                  onChange={(e) =>
                    setRestockQuantities((prev) => ({
                      ...prev,
                      [item.id]: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-16 border p-1"
                />
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => navigate(`/restock/${item.id}`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
