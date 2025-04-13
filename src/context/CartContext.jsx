import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const userId = JSON.parse(localStorage.getItem("user"))?.id || "guest";
  const CART_KEY = `cart-${userId}`;
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Fetch products based on category filter
  const fetchProducts = async (categoryIds = []) => {
    setProductsLoaded(false);
    let url = `${import.meta.env.VITE_API_URL}/product?`;
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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    setCartItems(stored);
    setCartLoaded(true);
  }, [CART_KEY]);

  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, cartLoaded, CART_KEY]);

  useEffect(() => {
    if (!cartLoaded || products.length === 0) return;
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
