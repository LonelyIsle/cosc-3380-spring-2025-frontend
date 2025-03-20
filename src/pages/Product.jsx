import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../Products.jsx";

function Product() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === parseInt(id, 10));

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

  // implement your cart functionality
  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
    alert(`${quantity} × ${product.name} added to your cart!`);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-pink-200 py-8">
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
                  <span className="text-sm text-gray-500">
                    Color: {product.color}
                  </span>
                </div>
                <p className="text-3xl font-bold text-pink-600 mb-4">
                  ${product.price}
                </p>
                <p className="text-gray-700 mb-4">{product.description}</p>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Details:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Size: {product.size} ft</li>
                    <li>Color: {product.color}</li>
                    <li>Categories: {product.category.join(", ")}</li>
                    {/* Add more details as needed */}
                  </ul>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="mr-3 font-medium">Quantity:</span>
                <div className="flex items-center border rounded">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 border-r hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 border-l hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
