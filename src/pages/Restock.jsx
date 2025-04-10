import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Restock = () => {
  const { productId } = useParams();
  const { state } = useLocation();
  const [restockAmount, setRestockAmount] = useState(state?.restockAmount || 0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    </div>
  );
};

export default Restock;
