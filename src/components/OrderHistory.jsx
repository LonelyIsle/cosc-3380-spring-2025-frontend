// OrderHistory.js
import { useState } from "react";
import { Dialog } from "@headlessui/react";

function OrderHistory({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div>
      <ul className="divide-y">
        {orders.map((order) => (
          <li key={order.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">Order #{order.id}</p>
              <p className="text-gray-500 text-sm">{order.date}</p>
            </div>
            <button
              onClick={() => setSelectedOrder(order)}
              className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Order #{selectedOrder?.id}
            </h2>
            <p>
              <strong>Date:</strong> {selectedOrder?.date}
            </p>
            <p>
              <strong>Total:</strong> ${selectedOrder?.total}
            </p>
            <h4 className="font-semibold mt-4">Items:</h4>
            <ul className="list-disc list-inside">
              {selectedOrder?.items.map((item, index) => (
                <li key={index}>
                  {item.name} x{item.quantity}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default OrderHistory;
