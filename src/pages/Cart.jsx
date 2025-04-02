import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";

function Cart() {
  const {
    cartItems,
    cartLoaded,
    updateQuantity,
    removeItem,
    getCartAmount,
    getProduct,
  } = useShop();

  if (!cartLoaded) {
    return (
      <div className="w-full max-w-5xl mx-auto text-center py-20">
        <p className="text-pink-500 animate-pulse font-semibold">
          Loading your cart...
        </p>
      </div>
    );
  }

  const totalCartAmount = getCartAmount();
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="relative flex w-full max-w-6xl mx-auto mt-10 gap-6">
      {/* Cart Items Section */}
      <div className="w-4/5 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🛒 Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map(({ id, quantity }) => {
                const product = getProduct(id);
                if (!product) return null;

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-sm text-gray-500"
                        src={product.image}
                        alt={product.name}
                      ></img>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${product.price}
                        </p>
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
              <div></div>
              <h3 className="text-xl font-bold">
                Subtotal: ${totalCartAmount}
              </h3>
            </div>
          </>
        )}
      </div>

      {/* Checkout Section */}
      <div className="w-1/5">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-10 aspect-square flex flex-col justify-between">
          <div className="border-b pb-4">
            <h3 className="text-xl font-bold mb-2">Order Summary</h3>
            <div className="flex justify-between text-gray-600">
              <span>Total Items:</span>
              <span className="font-semibold">{totalItems}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-2">
              <span>Subtotal:</span>
              <span className="font-semibold">${totalCartAmount}</span>
            </div>
          </div>

          {cartItems.length > 0 ? (
            <Link
              to="/checkout"
              className="w-full block text-center py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-bold"
            >
              Checkout Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
