import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useProduct } from "../context/ProductContext";

function Product() {
  const { addToCart, cartItems } = useCart();
  const { getProduct } = useProduct();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [maxAvailable, setMaxAvailable] = useState(0);

  const product = getProduct(id);

  // maximum available quantity (stock minus cart)
  useEffect(() => {
    if (product) {
      const cartItem = cartItems.find((item) => item.id === product.id);
      const inCart = cartItem ? cartItem.quantity : 0;
      const available = Math.max(0, product.quantity - inCart);
      setMaxAvailable(available);

      // If selected quantity exceeds available
      if (quantity > available) {
        setQuantity(available > 0 ? available : 0);
      } else if (quantity === 0 && available > 0) {
        setQuantity(1); // Reset to 1 if we had 0 but now have stock
      }
    }
  }, [product, cartItems, quantity]);

  if (!product) {
    return (
      <div className="min-h-screen bg-pink-200 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-4">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link
            to="/shop"
            className="bg-pink-300 px-4 py-2 rounded hover:bg-pink-400"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const itemInCart = cartItems.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product.id, quantity);
      alert(`${quantity} × ${product.name} added to your cart!`);

      const newAvailable = maxAvailable - quantity;
      setMaxAvailable(newAvailable);
      setQuantity(newAvailable > 0 ? 1 : 0);
    } else {
      alert(
        "Sorry, this item is out of stock or already in your cart at maximum quantity.",
      );
    }
  };

  const increaseQuantity = () => {
    if (quantity < maxAvailable) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/shop" className="text-pink-600 hover:underline">
            ← Back to Shop
          </Link>
        </div>

        {/* Product Detail Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-2">
                  <span className="bg-pink-200 px-2 py-1 rounded text-xs mr-2">
                    {product.category.join(", ")}
                  </span>
                </div>
                <p className="text-3xl font-bold text-pink-600 mb-4">
                  ${product.price}
                </p>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Details:</h3>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mb-3">
                <span className="mr-3 font-medium">Quantity:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 border-r hover:bg-gray-100"
                    disabled={quantity <= 1 || maxAvailable === 0}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 border-l hover:bg-gray-100"
                    disabled={quantity >= maxAvailable}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Inventory Information */}
              <div className="flex flex-col mb-8 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <span>Items in Stock:</span>
                  <span>{product.quantity}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-lg transition duration-300 ${
                  maxAvailable > 0
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {maxAvailable > 0 ? "Add to Cart" : "Not Available"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
