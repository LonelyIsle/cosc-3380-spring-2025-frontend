import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Fetch products based on category filter
  const fetchProducts = async (categoryIds = []) => {
    setProductsLoaded(false);
    let url = `${import.meta.env.VITE_API_URL}/product?limit=999`;
    if (categoryIds.length > 0) {
      url += `&category_id=[${categoryIds.join(",")}]`;
    }
    try {
      const res = await axios.get(url);
      const mappedproducts = res.data.data.rows.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        price: parseFloat(p.price),
        threshold: p.threshold,
        quantity: p.quantity,
        description: p.description,
        // Convert category array into an array of names for display
        category: p.category?.map((c) => c.name) || [],
        image: p.image
          ? `data:image/${p.image_extension};base64,${p.image}`
          : "",
      }));
      setProducts(mappedproducts);
      setProductsLoaded(true);
    } catch (err) {
      console.error(
        "Failed to fetch products:",
        err.response?.data || err.message,
      );
      setProductsLoaded(true);
    }
  };

  // Fetch products on first render
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products when selected categories change
  useEffect(() => {
    if (selectedCategoryIds.length > 0) {
      fetchProducts(selectedCategoryIds);
    }
  }, [selectedCategoryIds]);

  // Build a product map for quick lookup
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Load cart from localStorage on initial app render
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    setCartLoaded(true);
  }, []);

  // Update localStorage when cartItems change
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, cartLoaded]);

  // PRODUCT CONTEXT FUNCTIONS
  const getProductArray = () => products;
  const getProduct = (id) => {
    return products.find((p) => p.id === parseInt(id, 10));
  };

  // Update selected categories (for filtering products, if needed)
  const updateSelectedCategories = (categoryIds) => {
    setSelectedCategoryIds(categoryIds);
  };

  // POST request to add a new product

  const addProduct = async (productData) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/product`;
      const res = await axios.post(url, productData);
      const newProduct = res.data.data;

      // Update local state
      setProducts((prev) => [
        ...prev,
        {
          id: newProduct.id,
          sku: newProduct.sku,
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          threshold: newProduct.threshold,
          quantity: newProduct.quantity,
          description: newProduct.description,
          category: newProduct.category?.map((c) => c.name) || [],
          image: newProduct.image
            ? `data:image/${newProduct.image_extension};base64,${newProduct.image}`
            : "",
        },
      ]);

      return newProduct;
    } catch (err) {
      console.error(
        "Failed to add product:",
        err.response?.data || err.message,
      );
      throw err;
    }
  };
  // PATCH request to update an existing product

  // PATCH request to update an existing product ID

  // DELETE request to delete an existing product

  // CART CONTEXT FUNCTIONS
  const getCartAmount = () => {
    return cartItems
      .reduce((total, cartItem) => {
        const product = productMap.get(cartItem.id);
        return product ? total + product.price * cartItem.quantity : total;
      }, 0)
      .toFixed(2);
  };

  const getCartQuantity = () =>
    cartLoaded
      ? cartItems.reduce((total, item) => total + item.quantity, 0)
      : 0;

  const addToCart = (productId, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      const product = productMap.get(productId);

      if (!product || typeof product.quantity !== "number") {
        return prev;
      }

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        const limitedQuantity = Math.min(newQuantity, product.quantity);
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: limitedQuantity } : item,
        );
      }

      const limitedQuantity = Math.min(quantity, product.quantity);
      if (limitedQuantity > 0) {
        return [...prev, { id: productId, quantity: limitedQuantity }];
      }

      return prev;
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) => {
      const product = productMap.get(id);
      if (!product || typeof product.quantity !== "number") {
        return prev;
      }
      return prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          const limitedQuantity = Math.min(newQuantity, product.quantity);
          return { ...item, quantity: limitedQuantity };
        }
        return item;
      });
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // Fetch and store categories globally on first render
  useEffect(() => {
    const fetchCategories = async () => {
      const url = `${import.meta.env.VITE_API_URL}/category`;
      try {
        const res = await axios.get(url);
        const mappedCategories = res.data.data.rows
          .filter((p) => p.is_deleted !== 1)
          .map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            created_at: p.created_at,
            updated_at: p.updated_at,
          }));
        setCategories(mappedCategories);
      } catch (err) {
        console.error(
          "Failed to fetch categories:",
          err.response?.data || err.message,
        );
      } finally {
        setCategoriesLoaded(true);
      }
    };
    fetchCategories();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        cartLoaded,
        productsLoaded,
        getProductArray,
        getProduct,
        getCartAmount,
        getCartQuantity,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        updateSelectedCategories,
        categories,
        categoriesLoaded,
        addProduct,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
