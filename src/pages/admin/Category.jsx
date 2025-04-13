import { useEffect, useState } from "react";
import { useCategory } from "@context/CategoryContext";
import CategoryModalUpsert from "@modal/CategoryModalUpsert";
import CategoryModalDelete from "@modal/CategoryModalDelete";

const Category = () => {
  const { categories, deleteCategory } = useCategory();

  const [upsertModalOpen, setUpsertModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openUpsertModal = (categoryId = null) => {
    setSelectedCategoryId(categoryId);
    setUpsertModalOpen(true);
  };

  const openDeleteModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setSelectedCategoryId(null);
    setUpsertModalOpen(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModals();
    };

    if (upsertModalOpen || deleteModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [upsertModalOpen, deleteModalOpen]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  // Helper function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
    
    const datePart = date.toLocaleDateString('en-US', optionsDate);
    // Formats the time (e.g., "7:51 PM") and converts it to lowercase (e.g., "7:51pm")
    const timePart = date.toLocaleTimeString('en-US', optionsTime).replace(' ', '').toLowerCase();
    return `${datePart} - ${timePart}`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Category Management</h2>
        <button
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => openUpsertModal(null)}
        >
          + Add New Category
        </button>
      </div>

      <div className="flex justify-start items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
      </div>

      <table className="w-full border border-black bg-gray-200">
        <thead>
          <tr className="bg-gray-400 border-black text-black">
            <th className="p-2 text-center border">ID</th>
            <th className="p-2 text-center border">Name</th>
            <th className="p-2 text-center border">Description</th>
            <th className="p-2 text-center border">Created At</th>
            <th className="p-2 text-center border">Updated At</th>
            <th className="p-2 text-center border">Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cat, index) => (
            <tr
              key={cat.id}
              className={index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"}
            >
              <td className="p-2 text-center border">{cat.id}</td>
              <td className="p-2 text-center border">{cat.name}</td>
              <td className="p-2 text-center border">{cat.description}</td>
              <td className="p-2 text-center border">
                {formatDateTime(cat.created_at)}
              </td>
              <td className="p-2 text-center border">
                {formatDateTime(cat.updated_at)}
              </td>
              <td className="p-2 text-center border space-x-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openUpsertModal(cat.id)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => openDeleteModal(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {upsertModalOpen && (
        <CategoryModalUpsert
          categoryId={selectedCategoryId}
          onClose={closeModals}
        />
      )}

      {deleteModalOpen && selectedCategory && (
        <CategoryModalDelete
          category={selectedCategory}
          onCancel={closeModals}
          onConfirm={async () => {
            try {
              await deleteCategory(selectedCategory.id);
              closeModals();
            } catch (err) {
              console.error("Failed to delete category:", err);
              alert("Failed to delete category.");
            }
          }}
        />
      )}
    </div>
  );
};

export default Category;
