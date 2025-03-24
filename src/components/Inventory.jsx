import React, { useState, useEffect } from 'react';

// Mock inventory data (updated to match the products structure)
const mockInventory = [
  { id: 1, name: "Product 1", quantity: 50, restockThreshold: 20, price: 19.99, category: ["Animals", "Anime"], size: 1.5, color: "Red" },
  { id: 2, name: "Product 2", quantity: 10, restockThreshold: 5, price: 29.99, category: ["Movies & TV Shows"], size: 2.5, color: "Blue" },
  { id: 3, name: "Product 3", quantity: 100, restockThreshold: 30, price: 39.99, category: ["Anime"], size: 3.5, color: "Green" },
  { id: 4, name: "Product 4", quantity: 5, restockThreshold: 10, price: 49.99, category: ["Animals"], size: 4.5, color: "Blue" },
  { id: 5, name: "Product 5", quantity: 20, restockThreshold: 15, price: 59.99, category: ["Anime"], size: 5.5, color: "Red" },
  { id: 6, name: "Product 6", quantity: 8, restockThreshold: 12, price: 69.99, category: ["Anime"], size: 6.5, color: "Green" },
  { id: 7, name: "Product 7", quantity: 30, restockThreshold: 25, price: 79.99, category: ["Animals"], size: 7.5, color: "Red" },
  { id: 8, name: "Product 8", quantity: 15, restockThreshold: 10, price: 89.99, category: ["Anime"], size: 8.5, color: "Blue" },
  { id: 9, name: "Product 9", quantity: 5, restockThreshold: 8, price: 99.99, category: ["Anime"], size: 9.5, color: "Green" },
  { id: 10, name: "Product 10", quantity: 12, restockThreshold: 5, price: 109.99, category: ["Animals"], size: 0.5, color: "Red" },
];

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [restockQuantities, setRestockQuantities] = useState({});

  useEffect(() => {
    setInventory(mockInventory);
    const initialRestockQuantities = {};
    mockInventory.forEach((item) => {
      initialRestockQuantities[item.id] = 0;
    });
    setRestockQuantities(initialRestockQuantities);
  }, []);

  const handleRestockChange = (itemId, quantity) => {
    setRestockQuantities({ ...restockQuantities, [itemId]: parseInt(quantity, 10) || 0 });
  };

  const handleRestockSubmit = (itemId) => {
    const updatedInventory = inventory.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + restockQuantities[itemId] } : item
    );
    setInventory(updatedInventory);
    setRestockQuantities({ ...restockQuantities, [itemId]: 0 });
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-center mb-4">Inventory Management</h2>
        <table className="w-full border border-black bg-gray-200">
          <thead>
            <tr className="bg-gray-400 text-white">
              <th className="py-3 px-4 border border-black text-center">ID</th>
              <th className="py-3 px-4 border border-black text-center">Item Name</th>
              <th className="py-3 px-4 border border-black text-center">Quantity</th>
              <th className="py-3 px-4 border border-black text-center">Restock Threshold</th>
              <th className="py-3 px-4 border border-black text-center">Price ($)</th>
              <th className="py-3 px-4 border border-black text-center">Category</th>
              <th className="py-3 px-4 border border-black text-center">Size</th>
              <th className="py-3 px-4 border border-black text-center">Color</th>
              <th className="py-3 px-4 border border-black text-center">Restock Quantity</th>
              <th className="py-3 px-4 border border-black text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-100'}>
                <td className="py-3 px-4 border border-black text-center">{item.id}</td>
                <td className="py-3 px-4 border border-black text-center">{item.name}</td>
                <td className="py-3 px-4 border border-black text-center">
                  {item.quantity} {item.quantity <= item.restockThreshold && <span className="text-red-500"> (Low Stock)</span>}
                </td>
                <td className="py-3 px-4 border border-black text-center">{item.restockThreshold}</td>
                <td className="py-3 px-4 border border-black text-center">${item.price.toFixed(2)}</td>
                <td className="py-3 px-4 border border-black text-center">{item.category.join(", ")}</td>
                <td className="py-3 px-4 border border-black text-center">{item.size}</td>
                <td className="py-3 px-4 border border-black text-center">{item.color}</td>
                <td className="py-3 px-4 border border-black text-center">
                  <input
                    type="number"
                    value={restockQuantities[item.id]}
                    onChange={(e) => handleRestockChange(item.id, e.target.value)}
                    className="border border-black rounded p-1 w-20 text-center"
                  />
                </td>
                <td className="py-3 px-4 border border-black text-center">
                  <button
                    onClick={() => handleRestockSubmit(item.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded"
                  >
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
