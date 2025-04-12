import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CategoryChanges = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/category/${id}`);
        const data = await res.json();
        if (data.data) {
          setCategory({ name: data.data.name, description: data.data.description });
        }
      } catch (err) {
        console.error("Failed to load category", err);
      }
    };

    fetchCategory();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      alert("Category updated!");
      navigate("/admin");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/category/${id}`, { method: "DELETE" });
      alert("Category deleted!");
      navigate("/admin");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          value={category.description}
          onChange={(e) => setCategory({ ...category, description: e.target.value })}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="flex gap-4">
        <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update
        </button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Delete
        </button>
      </div>
    </div>
  );
};

export default CategoryChanges;
