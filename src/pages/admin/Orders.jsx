import React, { useEffect, useState } from "react";
import OrderModal from "src/components/modal/OrderModal";
import CancelOrderModal from "src/components/modal/CancelOrderModal";

const Orders = () => {
  const [pages, setPages] = useState({});
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at_desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const fetchPage = async (pageNum) => {
        let query = `limit=${limit}&offset=${pageNum * limit}&search=${encodeURIComponent(search)}&sort=${sort}`;
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/order?${query}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const result = await response.json();
        let rows = Array.isArray(result.data?.rows) ? result.data.rows : [];

        if (sort === "guest_only") {
          rows = rows.filter((o) => !o.customer_id);
        } else if (sort === "customer_only") {
          rows = rows.filter((o) => o.customer_id);
        }

        if (search.trim() !== "") {
          const searchLower = search.toLowerCase();
          rows = rows.filter((o) =>
            o.customer_email?.toLowerCase().includes(searchLower),
          );
        }

        return rows;
      };

      const [currentPage, nextPage] = await Promise.all([
        fetchPage(page),
        fetchPage(page + 1),
      ]);

      setPages((prev) => ({
        ...prev,
        [page]: currentPage,
        [page + 1]: nextPage,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, sort]);

  const statusMap = {
    [-1]: "Cancelled",
    0: "Pending",
    1: "Processing",
    2: "Shipped",
    3: "Delivered",
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by email..."
            className="border p-2 rounded w-full md:w-1/2"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
          <select
            className="border p-2 rounded w-full md:w-1/4"
            value={sort}
            onChange={(e) => {
              setPage(0);
              setSort(e.target.value);
            }}
          >
            <option value="created_at_desc">Newest</option>
            <option value="created_at_asc">Oldest</option>
            <option value="customer_only">Customer Orders</option>
            <option value="guest_only">Guest Orders</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-black bg-gray-100 text-center">
            <thead className="bg-gray-300">
              <tr>
                <th className="py-2 px-4 border border-black">ID</th>
                <th className="py-2 px-4 border border-black">Customer ID</th>
                <th className="py-2 px-4 border border-black">Customer Email</th>
                <th className="py-2 px-4 border border-black">Tracking</th>
                <th className="py-2 px-4 border border-black">Status</th>
                <th className="py-2 px-4 border border-black">Shipping Address</th>
                <th className="py-2 px-4 border border-black">Total Final</th>
                <th className="py-2 px-4 border border-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(pages[page]?.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan="8" className="py-4 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                pages[page].map((order, index) => (
                  <tr
                    key={order.id || index}
                    className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"} text-center`}
                  >
                    <td className="py-2 px-4 border border-black">
                      {order.id}
                    </td>
                    <td className="py-2 px-4 border border-black">
                      {order.customer_id ? order.customer_id : "Guest"}
                    </td>
                    <td className="py-2 px-4 border border-black">
                      {order.customer_email ?? "N/A"}
                    </td>
                    <td className="py-2 px-4 border border-black">
                      {order.tracking ?? "N/A"}
                    </td>
                    <td className="py-2 px-4 border border-black">
                      {statusMap[Number(order.status)] ?? "Unknown"}
                    </td>
                    <td className="py-2 px-4 border border-black">
                      {`${order.shipping_address_1 ?? ""}${order.shipping_address_2 ? ', ' + order.shipping_address_2 : ''}, ${order.shipping_address_city ?? ""}, ${order.shipping_address_state ?? ""} ${order.shipping_address_zip ?? ""}`}
                    </td>
                    <td className="py-2 px-4 border border-black">
                      ${order.total_final?.toFixed(2) ?? "0.00"}
                    </td>
                    <td className="py-2 px-4 border border-black space-x-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => {
                          setOrderToCancel(order);
                          setShowCancelModal(true);
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
          {/* Pagination limited to 10 items per page for performance */}
        </div>
        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onSave={async (updatedOrder) => {
              const newStatus = updatedOrder.tracking ? 2 : updatedOrder.status;

              try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_URL}/order/${updatedOrder.id}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: localStorage.getItem("token"),
                    },
                    credentials: "include",
                    body: JSON.stringify({
                      ...updatedOrder,
                      status: newStatus,
                    }),
                  },
                );
                if (!response.ok) {
                  throw new Error("Failed to update order");
                }
                const result = await response.json();
                setPages((prevPages) => ({
                  ...prevPages,
                  [page]: prevPages[page].map((o) =>
                    o.id === result.data.id
                      ? { ...o, ...result.data, status: newStatus }
                      : o,
                  ),
                }));
                setSelectedOrder(null);
              } catch (error) {
                console.error("Error updating order:", error);
              }
            }}
          />
        )}
        {showCancelModal && orderToCancel && (
          <CancelOrderModal
            order={orderToCancel}
            onCancel={() => {
              setOrderToCancel(null);
              setShowCancelModal(false);
            }}
            onConfirm={async () => {
              try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_URL}/order/${orderToCancel.id}/cancel`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: localStorage.getItem("token"),
                    },
                    credentials: "include",
                    body: JSON.stringify({ id: orderToCancel.id, status: -1 }), // Pass ID and status
                  },
                );
                if (!response.ok) {
                  throw new Error("Failed to cancel order");
                }
                setPages((prevPages) => ({
                  ...prevPages,
                  [page]: prevPages[page].map((o) =>
                    o.id === orderToCancel.id ? { ...o, status: -1 } : o,
                  ),
                }));
                setOrderToCancel(null);
                setShowCancelModal(false);
              } catch (error) {
                console.error("Error cancelling order:", error);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
