// OrderHistory.js
import { useState } from "react";
import { Dialog } from "@headlessui/react";

function OrderHistory({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusMap = {
    [-1]: "Cancelled",
    0: "Pending",
    1: "Shipped",
    2: "Shipped"
  };

  const renderStatus = (status) => {
    switch(status) {
      case -1:
        return( 
          <span className="bg-gray-300 p-1 rounded mr-2 text-sm text-black">
            {statusMap[status]}
          </span>
        );
        break;
      case 0:
        return ( 
          <span className="bg-green-200 p-1 rounded mr-2 text-sm text-black">
            {statusMap[status]}
          </span>
        );
        break;
      case 1:
        return ( 
          <span className="bg-gray-300 p-1 rounded mr-2 text-sm text-black">
            {statusMap[status]}
          </span>
        );
        break;
    }
  }

  return (
    <div>
      <ul className="divide-y">
        {orders.map((order) => (
          <li key={order.id} className="py-2 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">Order #{order.id}</p>
              <p className="font-medium text-gray-800">Total: ${order.total_final.toFixed(2)}</p>
              <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString("en-us")}</p>
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
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black rounded shadow-md w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] relative">
            <h2 className="text-xl font-bold mb-4">Order #{selectedOrder?.id}</h2>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2">
                <div>
                  <div className="mb-2">
                    <strong>Subtotal:</strong> $
                    {(selectedOrder?.total_origin ?? 0).toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>Subscription:</strong> $
                    {(selectedOrder?.total_subscription ?? 0).toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>Coupon:</strong> $
                    {(selectedOrder?.total_coupon ?? 0).toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>Shipping Fee:</strong> ${selectedOrder?.shipping_fee?.toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>Tax:</strong> ${(selectedOrder?.total_sale_tax ?? 0).toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>Total final:</strong> $
                    {(selectedOrder?.total_final ?? 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <strong>Email:</strong> {selectedOrder?.customer_email}
                  </div>
                  <div>
                  <strong>Status:</strong>{" "}
                    {renderStatus(selectedOrder?.status)}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg">
                      Shipping Address
                    </h3>
                    <div>{selectedOrder?.shipping_address_1}</div>
                    <div>{selectedOrder?.shipping_address_2}</div>
                    <div>
                      {selectedOrder?.shipping_address_city}, {selectedOrder?.shipping_address_state}{" "}
                      {selectedOrder?.shipping_address_zip}
                    </div>
                  </div>
                </div>
              </div>
              {selectedOrder?.items?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg text-black">
                    Products Ordered
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {selectedOrder?.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-400 p-3 rounded shadow text-black"
                      >
                        <div>
                          <div className="font-semibold">{item.product ? item.product.name : "N/A"}</div>
                          <div className="text-sm text-black-400">
                            Price: ${item.price?.toFixed(2) ?? "0.00"}
                          </div>
                          <div className="text-sm text-black-400">
                            Quantity: {item.quantity ?? 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 text-right">
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
