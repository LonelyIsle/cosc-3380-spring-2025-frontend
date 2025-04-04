import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Fetch product data on first render
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/product?limit=999`)
      .then((res) => {
        const products = res.data.data.rows.map((p) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price),
          quantity: p.quantity,
          description: p.description,
          category: p.category || [],
          image: p.image
            ? `data:image/${p.image_extension};base64,${p.image}`
            : "",

          // TEMP MOCK
          size: 1 + Math.random() * 4,
          color: ["Red", "Blue", "Green", "Yellow", "Black"][p.id % 5],
        }));
        setProducts(products);
        setProductsLoaded(true);
      })
      .catch((err) => {
        console.error(
          "Failed to fetch products:",
          err.response?.data || err.message,
        );
      });
  }, []);

  const productMap = new Map(products.map((p) => [p.id, p])); // Rebuild when products change

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart); // load cart from localstorage on initial app render
    setCartLoaded(true); // mark as loaded to allow dependent components to now load
  }, []);

  useEffect(() => {
    // update localstorage when cartItems change
    if (cartLoaded) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, cartLoaded]);

  // PRODUCT CONTEXT FUNCTIONS

  const getProductArray = () => products;

  const getProduct = (id) => {
    return products.find((p) => p.id === parseInt(id, 10));
  };

  // CART CONTEXT FUNCTIONS

  const getCartAmount = () => {
    // pull cart amount
    return cartItems
      .reduce((total, cartItem) => {
        const product = productMap.get(cartItem.id);
        return product ? total + product.price * cartItem.quantity : total;
      }, 0)
      .toFixed(2);
  };

  const getCartQuantity = () => {
    // pull current cart quantity
    return cartLoaded
      ? cartItems.reduce((total, item) => total + item.quantity, 0)
      : 0;
  };

  const addToCart = (productId, quantity = 1) => {
    // add product to cart
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      const product = productMap.get(productId);

      // If product doesn't exist or has no quantity property, return unchanged
      if (!product || typeof product.quantity !== "number") {
        return prev;
      }

      if (existing) {
        // Calculate the new potential quantity
        const newQuantity = existing.quantity + quantity;

        // Ensure the quantity doesn't exceed the available product quantity
        const limitedQuantity = Math.min(newQuantity, product.quantity);

        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: limitedQuantity } : item,
        );
      }

      // For new items, ensure we don't add more than available
      const limitedQuantity = Math.min(quantity, product.quantity);

      // Only add to cart if there's available quantity
      if (limitedQuantity > 0) {
        return [...prev, { id: productId, quantity: limitedQuantity }];
      }

      return prev;
    });
  };

  const updateQuantity = (id, delta) => {
    // update quantity of product in cart
    setCartItems((prev) => {
      const product = productMap.get(id);

      // If product doesn't exist or has no quantity property, return unchanged
      if (!product || typeof product.quantity !== "number") {
        return prev;
      }

      return prev.map((item) => {
        if (item.id === id) {
          // Calculate new quantity ensuring it's at least 1 and no more than product quantity
          const newQuantity = Math.max(1, item.quantity + delta);
          const limitedQuantity = Math.min(newQuantity, product.quantity);

          return { ...item, quantity: limitedQuantity };
        }
        return item;
      });
    });
  };

  const removeItem = (id) => {
    // remove item from cart
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]); // clear cart completely

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
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
