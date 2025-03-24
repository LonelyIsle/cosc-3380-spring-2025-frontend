import React, { useState, useEffect } from 'react';

// Mock inventory data (replace with your API calls)
const mockInventory = [
  { id: 1, name: 'Plushie 1', quantity: 50, restockThreshold: 20 },
  { id: 2, name: 'Plushie 2', quantity: 10, restockThreshold: 5 },
  { id: 3, name: 'Plushie 3', quantity: 100, restockThreshold: 30 },
  { id: 4, name: 'Plushie 4', quantity: 5, restockThreshold: 10 },
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
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-4">Inventory Management</h2>
        <table className="w-full border border-black bg-gray-200">
          <thead>
            <tr className="bg-gray-400 text-white">
              <th className="py-3 px-4 border border-black text-center">ID</th>
              <th className="py-3 px-4 border border-black text-center">Item Name</th>
              <th className="py-3 px-4 border border-black text-center">Quantity</th>
              <th className="py-3 px-4 border border-black text-center">Restock Threshold</th>
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
