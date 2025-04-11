import { useEffect, useState } from "react";
import { format } from "date-fns";

const Config = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/category`);
        const data = await res.json();
        console.log("Category response data:", data);
        setCategories(Array.isArray(data?.data?.rows) ? data.data.rows : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex justify-end mb-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded"
          onClick={() => alert("Create new category functionality coming soon")}
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
                  {format(new Date(category.created_at), "MMM dd, yyyy - h:mm a")}
                </td>
                <td className="p-2 border">
                  {format(new Date(category.updated_at), "MMM dd, yyyy - h:mm a")}
                </td>
                <td className="p-2 border">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => window.location.href = `/edit-category/${category.id}`}
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
    </div>
  );
};

export default Config;
