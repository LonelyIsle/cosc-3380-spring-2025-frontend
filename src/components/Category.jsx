import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useShop } from "../context/ShopContext";
import CategoryModalUpsert from "./CategoryModalUpsert";
import CategoryModalDelete from "./CategoryModalDelete";

const Config = () => {
  const { categories, categoriesLoaded } = useShop();
  // using categoriesLoaded for loading categories pages. will implement
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [createCategoryTarget, setCreateCategoryTarget] = useState(null);
  const [editCategoryTarget, setEditCategoryTarget] = useState(null);

  const openEditModal = (productId = null) => {
    setSelectedProductId(productId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy - h:mm a");
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex justify-end mb-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded"
          onClick={() => openEditModal(null)}
        >
          Create New Category
        </button>
      </div>
      <table className="w-full border border-black bg-gray-200">
        <thead>
          <tr className="bg-gray-400 text-white">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Updated At</th>
            <th className="p-2 border">Manage</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id} className="bg-gray-100">
                <td className="p-2 border">{category.id}</td>
                <td className="p-2 border">{category.name}</td>
                <td className="p-2 border">{category.description}</td>
                <td className="p-2 border">
                  {formatDate(category.created_at)}
                </td>
                <td className="p-2 border">
                  {formatDate(category.updated_at)}
                </td>
                <td className="p-2 border">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() =>
                      (window.location.href = `/edit-category/${category.id}`)
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-2 text-center text-gray-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modalOpen && (
        <CategoryModalUpsert
          productId={selectedProductId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Config;
