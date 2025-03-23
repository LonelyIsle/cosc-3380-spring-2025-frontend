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

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Shopping Cart</h2>

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
            <Link
              to="/checkout"
              className="text-xl font-bold text-red-500 hover:text-red-700"
            >
              Proceed to Checkout
            </Link>
            <h3 className="text-xl font-bold">Total: ${totalCartAmount}</h3>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
