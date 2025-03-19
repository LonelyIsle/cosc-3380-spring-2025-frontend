import React from "react";

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg overflow-hidden shadow-sm"
        >
          {/* Image Section */}
          <div className="bg-gray-200 h-40 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="p-2 bg-pink-100">
            <h3 className="font-medium text-sm">{product.name}</h3>
            <p className="text-xs text-gray-600">
              {product.category.join(", ")}
            </p>
            <div className="flex justify-between items-center mt-1">
              <p className="font-bold text-sm">${product.price}</p>
              <span className="text-xs bg-pink-200 px-2 py-0.5 rounded">
                {product.category.join(", ")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
