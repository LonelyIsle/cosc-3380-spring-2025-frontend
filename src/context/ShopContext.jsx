import { createContext, useContext, useEffect, useState } from "react";
import products from "../Products.jsx";

// Declare productMap globally once, so it's not recalculated on every render
const productMap = new Map(products.map((p) => [p.id, p]));

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

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
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { id: productId, quantity }];
    });
  };

  const updateQuantity = (id, delta) => {
    // update quantity of product in cart
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
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
