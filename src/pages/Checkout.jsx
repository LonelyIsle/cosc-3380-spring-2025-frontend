import React, { useState } from "react";
import { useShop } from "../context/ShopContext";

const Checkout = () => {
  const {
    cartItems,
    getProduct,
    getCartAmount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useShop();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    //Add backend code
    alert("Order Submitted! Thank you for your purchase.");
    clearCart();
  };

  const renderCartItems = () => {
    return cartItems.map((cartItem) => {
      const product = getProduct(cartItem.id);
      if (!product) return null;

      return (
        <div
          key={cartItem.id}
          className="flex items-center justify-between border-b py-4"
        >
          <div className="flex items-center space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-gray-500">${product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="border rounded p-1 hover:bg-gray-100"
              onClick={() => updateQuantity(cartItem.id, -1)}
            >
              -
            </button>
            <span>{cartItem.quantity}</span>
            <button
              className="border rounded p-1 hover:bg-gray-100"
              onClick={() => updateQuantity(cartItem.id, 1)}
            >
              +
            </button>
            <button
              className="border rounded p-1 text-red-500 hover:bg-red-50"
              onClick={() => removeItem(cartItem.id)}
            >
              ×
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Cart Items Section */}
        <div className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
          </div>
          <div className="p-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <>
                {renderCartItems()}
                <div className="flex justify-between mt-4 font-bold">
                  <span>Total</span>
                  <span>${getCartAmount()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Shipping Information Section */}
        <div className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Shipping Information</h2>
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    className="w-full border rounded-md px-3 py-2"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    className="w-full border rounded-md px-3 py-2"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full border rounded-md px-3 py-2"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  className="w-full border rounded-md px-3 py-2"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    className="w-full border rounded-md px-3 py-2"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Zip Code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    className="w-full border rounded-md px-3 py-2"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                disabled={cartItems.length === 0}
              >
                Complete Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
