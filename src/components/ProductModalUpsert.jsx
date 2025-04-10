import { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";

const defaultProduct = {
  sku: "",
  price: "",
  quantity: "",
  threshold: "",
  name: "",
  description: "",
  image: null,
  image_extension: "",
  category: [],
};

const ProductModalUpsert = ({ productId = null, onClose }) => {
  const [product, setProduct] = useState(defaultProduct);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { getProduct, getAllCategories } = useShop();

  // Fetch product info if updating product
  useEffect(() => {
    if (productId !== null) {
      setLoading(true);

      // TODO: add API call to fetch product by ID

      const fetchProduct = async () => {
        try {
          const data = getProduct(productId);
          setProduct(data);
          console.log("Product fetched:", data);
        } catch (err) {
          console.error("Error fetching product:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({
        ...prev,
        image: file,
        image_extension: file.name.split(".").pop(),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛠️ TODO: Handle API call for insert or update
    if (productId === null) {
      console.log("Creating product...", product);
    } else {
      console.log("Updating product...", product);
    }

    onClose(); // Close the modal after submit
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center
      items-center z-50"
      style={{ backgroundColor: `rgba(24, 24, 37, 0.7)` }}
      onClick={onClose}
    >
      <div
        className="bg-surface0 text-text p-6 rounded-2xl shadow-lg w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {productId ? "Update Product" : "Add New Product"}
        </h2>

        {loading ? (
          <p className="text-overlay1">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center items-center gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
              />

              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={product.sku}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
              />
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-surface1 text-text"
            />

            <div className="flex justify-center items-center gap-4">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
              />

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={product.quantity}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
              />
            </div>

            <select
              name="category"
              value={product.category[0]?.id || ""}
              onChange={(e) => {
                const selected = categories.find(
                  (cat) => cat.id === parseInt(e.target.value),
                );
                setProduct((prev) => ({
                  ...prev,
                  category: selected ? [selected] : [],
                }));
              }}
              className="w-full p-2 rounded bg-surface1 text-text"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {productId ? (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm"
              />
            ) : null}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-green rounded hover:bg-teal text-black transition"
              >
                {productId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default ProductModalUpsert;
