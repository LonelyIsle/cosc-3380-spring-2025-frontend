import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProduct } from "./ProductContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const userId = JSON.parse(localStorage.getItem("user"))?.id || "guest";
  const CART_KEY = `cart-${userId}`;

  const { products } = useProduct();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Build product map from ProductContext data
  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  // Load cart from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    setCartItems(stored);
    setCartLoaded(true);
  }, [CART_KEY]);

  // Save cart to localStorage
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, cartLoaded, CART_KEY]);

  // Sync cart with available product stock (e.g., after restocking or product load)
  useEffect(() => {
    if (!cartLoaded || productMap.size === 0) return;
    setCartItems((prev) =>
      prev
        .map((item) => {
          const product = productMap.get(item.id);
          if (!product) return null;
          const quantity = Math.min(item.quantity, product.quantity);
          return { id: item.id, quantity };
        })
        .filter(Boolean),
    );
  }, [products, cartLoaded]);

  const getCartAmount = () =>
    cartItems
      .reduce((total, item) => {
        const product = productMap.get(item.id);
        return product ? total + product.price * item.quantity : total;
      }, 0)
      .toFixed(2);

  const getCartQuantity = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (id, quantity = 1) => {
    const product = productMap.get(id);
    if (!product || product.quantity === 0) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.quantity);
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item,
        );
      } else {
        return [
          ...prev,
          { id, quantity: Math.min(quantity, product.quantity) },
        ];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    const product = productMap.get(id);
    if (!product) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                Math.max(1, item.quantity + delta),
                product.quantity,
              ),
            }
          : item,
      ),
    );
  };

  const removeItem = (id) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoaded,
        getCartAmount,
        getCartQuantity,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
