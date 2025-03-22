import { useEffect, useState } from "react";
import products from "../Products.jsx";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // finds old cart items saved in local storage on render
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    // updates local storage with new items under "cart"
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id, delta) => {
    // select corresponding id, and increase/decrease by delta
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    // filters out items that matches the id
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const productMap = new Map(products.map((p) => [p.id, p]));
  // converts products array to map for O(1) lookup time

  const getTotal = () => {
    // returns total price of all items in cart
    return cartItems
      .reduce((total, cartItem) => {
        const product = productMap.get(cartItem.id);
        return product ? total + product.price * cartItem.quantity : total;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map(({ id, quantity }) => {
              const product = products.find((p) => p.id === id);
              if (!product) return null;

              return (
                <div
                  key={id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-sm text-gray-500">
                      No Image
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => updateQuantity(id, -1)}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => updateQuantity(id, 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="font-semibold">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-xl font-bold">Total:</h3>
            <p className="text-xl font-semibold">${getTotal()}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
