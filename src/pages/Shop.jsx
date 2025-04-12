import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import axios from "axios";

function Shop() {
  const navigate = useNavigate();
  const { getProductArray, productsLoaded, updateSelectedCategories } =
    useShop();
  const products = getProductArray();
  console.log(products, "Products from shop");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Categories state
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Dynamic price range state
  const [maxPrice, setMaxPrice] = useState(50);
  const [priceRange, setPriceRange] = useState(50);

  // Calculate current products
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Set max price based on highest priced product (rounded to nearest $10)
  useEffect(() => {
    if (productsLoaded && products.length > 0) {
      const highestPrice = Math.max(
        ...products.map((product) => product.price)
      );
      // Round to nearest $10
      const roundedPrice = Math.ceil(highestPrice / 10) * 10;
      setMaxPrice(roundedPrice);
      setPriceRange(roundedPrice); // Initialize price range to max price
    }
  }, [productsLoaded, products]);

  // Fetch categories from backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/category`)
      .then((res) => {
        const fetchedCategories = res.data.data.rows || [];

        // Filter out deleted categories, not sure why this is in DB
        const activeCategories = fetchedCategories.filter(
          (category) => !category.is_deleted
        );

        setCategories(activeCategories);

        // Initialize selectedCategories
        const categoriesObj = {};
        activeCategories.forEach((category) => {
          categoriesObj[category.name] = false;
        });
        setSelectedCategories(categoriesObj);
        setCategoriesLoaded(true);
      })
      .catch((err) => {
        console.error(
          "Failed to fetch categories:",
          err.response?.data || err.message
        );
        setCategoriesLoaded(true);
      });
  }, []);

  // Update filtered products when products are loaded
  useEffect(() => {
    if (productsLoaded) {
      setFilteredProducts(products);
    }
  }, [productsLoaded, products]);

  // Pagination change handler
  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  // Apply filters when any filter changes except categories
  useEffect(() => {
    if (!productsLoaded || !categoriesLoaded) return;

    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price
    result = result.filter((product) => product.price <= priceRange);

    // Apply sort
    const sorted = [...result].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    setFilteredProducts(sorted);
    // Reset to first page when filters change
    setPage(1);
  }, [
    searchTerm,
    priceRange,
    sortOrder,
    productsLoaded,
    categoriesLoaded,
    products,
  ]);

  // Update selected categories and fetch products when categories change
  useEffect(() => {
    if (!categoriesLoaded) return;

    const activeCategories = Object.keys(selectedCategories).filter(
      (cat) => selectedCategories[cat]
    );

    // Get active category IDs
    const activeCategoryIds = [];
    if (activeCategories.length > 0) {
      categories.forEach((category) => {
        if (activeCategories.includes(category.name)) {
          activeCategoryIds.push(category.id);
        }
      });
    }

    // Update selected category IDs
    updateSelectedCategories(activeCategoryIds);
  }, [selectedCategories, categoriesLoaded, categories]);

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories({
      ...selectedCategories,
      [category]: !selectedCategories[category],
    });
  };

  // Reset all category filters
  const resetCategories = () => {
    const resetCategoriesObj = {};
    Object.keys(selectedCategories).forEach((category) => {
      resetCategoriesObj[category] = false;
    });
    setSelectedCategories(resetCategoriesObj);
  };

  // Sort products function
  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    let pages = [];

    // Always show first page
    pages.push(1);

    // Add current page and neighbors
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    // Always show last page if there's more than one page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    // Sort and add ellipses
    pages.sort((a, b) => a - b);

    let result = [];
    for (let i = 0; i < pages.length; i++) {
      result.push(pages[i]);

      // Add ellipsis if there's a gap
      if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) {
        result.push("...");
      }
    }

    return result;
  };

  // Check if any categories are selected
  const anyCategoriesSelected = Object.values(selectedCategories).some(
    (value) => value === true
  );

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
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">Categories</h2>
              {anyCategoriesSelected && (
                <button
                  onClick={resetCategories}
                  className="text-xs bg-pink-200 hover:bg-pink-300 px-2 py-1 rounded transition-colors"
                >
                  Reset Categories
                </button>
              )}
            </div>
            {/* Filter Options with Reset Button */}
            <div className="mb-6">
              <div className="space-y-1.5">
                {categoriesLoaded ? (
                  Object.keys(selectedCategories).length > 0 ? (
                    Object.keys(selectedCategories).map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 mr-2"
                          checked={selectedCategories[category]}
                          onChange={() => toggleCategory(category)}
                        />
                        <div>
                          <div className="font-medium">{category}</div>
                          <div className="text-gray-500 text-xs">
                            {categories.find((cat) => cat.name === category)
                              ?.description || ""}
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No categories found</p>
                  )
                ) : (
                  <p className="text-gray-500 text-sm">Loading categories...</p>
                )}
              </div>
            </div>

            {/* Price Range Slider with Dynamic Max Value */}
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
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
              />
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
            {productsLoaded && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
                {currentProducts.map((product) => (
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
                        {product.description}
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
            )}

            {/* Loading state */}
            {(!productsLoaded || !categoriesLoaded) && (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg p-8 text-center">
                <svg
                  className="animate-spin h-8 w-8 text-pink-500 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <h3 className="text-lg font-medium mb-2">Loading...</h3>
                <p className="text-gray-500">
                  Please wait while we fetch products and categories
                </p>
              </div>
            )}

            {/* Pagination with Tailwind */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center space-y-2 mt-8 mb-8">
                <p className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </p>
                <div className="flex space-x-2">
                  {/* Previous button */}
                  <button
                    onClick={() => page > 1 && handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded-md ${
                      page === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    &laquo;
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        pageNum !== "..." && handlePageChange(pageNum)
                      }
                      disabled={pageNum === "..."}
                      className={`px-3 py-1 rounded-md ${
                        pageNum === page
                          ? "bg-pink-500 text-white"
                          : pageNum === "..."
                            ? "bg-gray-100 text-gray-700 cursor-default"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next button */}
                  <button
                    onClick={() =>
                      page < totalPages && handlePageChange(page + 1)
                    }
                    disabled={page === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      page === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    &raquo;
                  </button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {productsLoaded &&
              categoriesLoaded &&
              filteredProducts.length === 0 && (
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
                  <h3 className="text-lg font-medium mb-2">
                    No products found
                  </h3>
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
