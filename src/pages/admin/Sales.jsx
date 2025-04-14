import { useSale } from "@context/SalesContext";
import { useState, useEffect } from "react";
import SaleEventModalUpsert from "@modal/SaleEventModalUpsert";
import DeleteSaleEventModal from "@modal/DeleteSaleEventModal";

const Sales = () => {
  const { sales, deleteSaleEvent, salesLoaded } = useSale();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [deleteSaleTarget, setDeleteSaleTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openUpsertModal = (saleId = null) => {
    setSelectedSaleId(saleId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSaleId(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
        setDeleteSaleTarget(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, deleteSaleTarget]);

  // Removed sort functionality. Now filteredSales only filters by title.
  const filteredSales = sales.filter((sale) =>
    sale.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sale Event Management</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => openUpsertModal()}
        >
          + Add New Sale Event
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
      </div>

      <table className="w-full border border-black bg-gray-200">
        <thead className="bg-gray-400 text-black">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Coupon</th>
            <th className="p-2 border">Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale, index) => (
            <tr
              key={sale.id}
              className={index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"}
            >
              <td className="p-2 border text-center">{sale.id}</td>
              <td className="p-2 border text-center">{sale.title}</td>
              <td className="p-2 border text-center">
                {sale.start_at.split("T")[0]}
              </td>
              <td className="p-2 border text-center">
                {sale.end_at.split("T")[0]}
              </td>
              <td className="p-2 border text-center">
                {sale.coupon?.code || "N/A"}
              </td>
              <td className="p-2 border text-center">
                <button
                  className="mx-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openUpsertModal(sale.id)}
                >
                  Edit
                </button>
                <button
                  className="mx-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setDeleteSaleTarget(sale)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <SaleEventModalUpsert saleId={selectedSaleId} onClose={closeModal} />
      )}
      {deleteSaleTarget && (
        <DeleteSaleEventModal
          sale={deleteSaleTarget}
          onCancel={() => setDeleteSaleTarget(null)}
          onConfirm={async () => {
            try {
              await deleteSaleEvent(deleteSaleTarget.id);
              setDeleteSaleTarget(null);
            } catch (err) {
              console.error("Delete failed", err);
              alert("Failed to delete sale event.");
            }
          }}
        />
      )}
    </div>
  );
};

export default Sales;
