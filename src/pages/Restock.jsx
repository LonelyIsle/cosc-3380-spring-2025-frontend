import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Restock = () => {
  const { productId } = useParams();
  const { state } = useLocation();
  const [restockAmount, setRestockAmount] = useState(state?.restockAmount || 0);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/product/${productId}`);
        const product = response.data;
        setProductName(product.name);
        setProductPrice(product.price);
      } catch (err) {
        console.error("Failed to load product details", err);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/product/${productId}/restock`,
        {
          restockAmount,
        },
      );
      setMessage("Product restocked successfully.");
      setTimeout(() => navigate("/admin", { state: { tab: "product-management" } }), 1500);
    } catch (err) {
      setMessage("Failed to restock product.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/product/${productId}`, {
        name: productName,
        price: productPrice,
      });
      setMessage("Product updated successfully.");
    } catch (err) {
      setMessage("Failed to update product.");
      console.error(err);
    }
  };

  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/product/${productId}`);
      navigate("/admin", { state: { tab: "product-management" } });
    } catch (err) {
      setMessage("Failed to delete product.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Restock Product #{productId}</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Restock Quantity:</label>
        <input
          type="number"
          min="0"
          value={restockAmount}
          onChange={(e) => setRestockAmount(parseInt(e.target.value, 10))}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Restocking..." : "Submit"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
      <hr className="my-6" />
      <h3 className="text-xl font-semibold mb-2">Edit Product Info</h3>
      <label className="block mb-2">Name:</label>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <label className="block mb-2">Price:</label>
      <input
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(parseFloat(e.target.value))}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleUpdateProduct}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Update Product
      </button>

      <button
        onClick={handleDeleteProduct}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete Product
      </button>
    </div>
  );
};

export default Restock;
