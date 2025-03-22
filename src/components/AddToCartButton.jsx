import { useCart } from "../context/CartContext";
import { useState } from "react";

function AddToCartButton({ productId }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(productId);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <button
      className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
      onClick={handleAdd}
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}

export default AddToCartButton;
