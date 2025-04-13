import { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";

const CategoryModalUpsert = ({ categoryId = null, onClose }) => {
  const [category, setCategory] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const { addCategory, updateCategory, getCategory } = useShop();

  useEffect(() => {
    // only fetch if editing
    if (categoryId !== null) {
      setLoading(true);
      const fetchCategory = async () => {
        try {
          const data = await getCategory(categoryId);
          setCategory({ name: data.name, description: data.description });
        } catch (err) {
          console.error("Error fetching category:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    } else {
      // reset fields for creation
      setCategory({ name: "", description: "" });
    }
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoryId === null) {
        await addCategory(category);
      } else {
        await updateCategory(categoryId, category);
      }
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(24, 24, 37, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="bg-surface0 text-text p-6 rounded-2xl shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {categoryId ? "Update Category" : "Add New Category"}
        </h2>
        {loading ? (
          <p className="text-overlay1">Loading category...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Category Name"
                value={category.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={category.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green rounded hover:bg-teal text-black transition"
              >
                {categoryId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CategoryModalUpsert;
