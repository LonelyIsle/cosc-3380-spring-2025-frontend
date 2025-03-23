import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Shop() {
  const navigate = useNavigate();
  const { getProductArray } = useShop();
  const products = getProductArray();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState({
    Animals: false,
    "Movies & TV Shows": false,
    Anime: false,
  });
  const [priceRange, setPriceRange] = useState(150);
  const [sizeRange, setSizeRange] = useState(10);
  const [selectedColors, setSelectedColors] = useState({
    Red: false,
    Blue: false,
    Green: false,
  });

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by categories
    const activeCategories = Object.keys(selectedCategories).filter(
      (cat) => selectedCategories[cat],
    );

    if (activeCategories.length > 0) {
      result = result.filter((product) =>
        product.category.some((cat) => activeCategories.includes(cat)),
      );
    }

    // Filter by price
    result = result.filter((product) => product.price <= priceRange);

    // Filter by size
    result = result.filter((product) => product.size <= sizeRange);

    // Filter by colors
    const activeColors = Object.keys(selectedColors).filter(
      (color) => selectedColors[color],
    );
    if (activeColors.length > 0) {
      result = result.filter((product) => activeColors.includes(product.color));
    }

    // Apply sort
    const sorted = [...result].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price,
    );

    setFilteredProducts(sorted);
  }, [
    searchTerm,
    selectedCategories,
    priceRange,
    sizeRange,
    selectedColors,
    sortOrder,
  ]);

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories({
      ...selectedCategories,
      [category]: !selectedCategories[category],
    });
  };

  // Toggle color selection
  const toggleColor = (color) => {
    setSelectedColors({
      ...selectedColors,
      [color]: !selectedColors[color],
    });
  };

  // Sort products function
  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // For debugging - log the number of products
  console.log(`Total products in filteredProducts: ${filteredProducts.length}`);

  return (
    <>
      {/* Main Container */}
      <div className="w-full px-4 py-6">
        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Panel */}
          <div className="w-full md:w-72 lg:w-100 bg-white rounded-lg p-4 shadow-sm sticky top-25 self-start">
            <div className="mb-6">
              <h2 className="font-medium mb-3">Search and Filter</h2>
            </div>

            {/* Filter Options*/}
            <div className="mb-6 space-y-1.5">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked={selectedCategories["Animals"]}
                  onChange={() => toggleCategory("Animals")}
                />
                <div>
                  <div className="font-medium">Animals</div>
                  <div className="text-gray-500 text-xs">
                    Cute and fluffy companions
                  </div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked={selectedCategories["Movies & TV Shows"]}
                  onChange={() => toggleCategory("Movies & TV Shows")}
                />
                <div>
                  <div className="font-medium">Movies & TV Shows</div>
                  <div className="text-gray-500 text-xs">
                    Entertainment favorites
                  </div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked={selectedCategories["Anime"]}
                  onChange={() => toggleCategory("Anime")}
                />
                <div>
                  <div className="font-medium">Anime</div>
                  <div className="text-gray-500 text-xs">
                    Japanese animation
                  </div>
                </div>
              </label>
            </div>

            {/* Price Range Slider*/}
            <div className="mb-4">
              <h2 className="font-medium mb-1">Price</h2>
              <div className="flex justify-between text-xs mb-1">
                <span>$0</span>
                <span>${priceRange}</span>
              </div>
              <input
                type="range"
                className="w-full"
                min="0"
                max="150"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
              />
            </div>

            {/* Size Range Slider */}
            <div className="mb-4">
              <h2 className="font-medium mb-1">Size</h2>
              <div className="flex justify-between text-xs mb-1">
                <span>.5Ft</span>
                <span>{sizeRange}Ft</span>
              </div>
              <input
                type="range"
                className="w-full"
                min="0.5"
                max="10"
                step="0.5"
                value={sizeRange}
                onChange={(e) => setSizeRange(parseFloat(e.target.value))}
              />
            </div>

            {/* Color Filter */}
            <div className="mb-4">
              <h2 className="font-medium mb-2">Color</h2>
              <div className="space-y-1.5">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2"
                    checked={selectedColors["Red"]}
                    onChange={() => toggleColor("Red")}
                  />
                  <span>Red</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2"
                    checked={selectedColors["Blue"]}
                    onChange={() => toggleColor("Blue")}
                  />
                  <span>Blue</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2"
                    checked={selectedColors["Green"]}
                    onChange={() => toggleColor("Green")}
                  />
                  <span>Green</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="flex-1">
            {/* Search and Sort Controls*/}
            <div className="flex flex-col md:flex-row gap-2 justify-between mb-4">
              <div className="relative w-full md:w-64 lg:w-200 shadow-sm transition-transform duration-300 hover:scale-102">
                <input
                  type="text"
                  placeholder="Search"
                  className="border rounded-full pl-4 pr-10 py-1.5 w-full bg-pink-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort("asc")}
                  className={`${sortOrder === "asc" ? "bg-pink-300" : "bg-pink-100"} px-3 py-1.5 rounded text-sm`}
                >
                  Price ascending
                </button>
                <button
                  onClick={() => handleSort("desc")}
                  className={`${sortOrder === "desc" ? "bg-pink-300" : "bg-pink-100"} px-3 py-1.5 rounded text-sm`}
                >
                  Price descending
                </button>
              </div>
            </div>

            {/* Products Count */}
            <div className="mb-4 text-sm">
              Showing {filteredProducts.length} products
            </div>
            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="bg-gray-200 h-40 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
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

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
