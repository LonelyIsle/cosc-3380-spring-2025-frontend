import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    getProduct,
    getCartAmount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useShop();

  const [isSubscription, setIsSubscription] = useState(false);

  const [coupon, setCoupon] = useState({
    input: "",
    code: "",
    id: null,
    value: 0,
    type: 0,
  });

  const [config, setConfig] = useState({
    subscriptionDiscountPercentage: 0,
    shippingFee: 0,
    saleTax: 0
  });

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const getConfig = async () => {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_API_URL}/config`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setConfig((prev) => ({
        ...prev,
        ["shippingFee"]: res.data.data.shipping_fee,
        ["saleTax"]: res.data.data.sale_tax,
        ["subscriptionDiscountPercentage"]: res.data.data.subscription_discount_percentage
      }));
    } catch(err) {
      if (err.response) {
        alert(err.response.data.message || "Error getting config");
      } else {
        alert("Network error. Please try again.");
      }
    }
  }

  // Load user data from localStorage and other data on component mount
  useEffect(() => {
    getConfig();
    
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);

        if (parsedUserData.subscription && parsedUserData.subscription.id) {
          setIsSubscription(true);
        }

        // Prefill shipping information from localStorage data
        setShippingInfo({
          firstName: parsedUserData.first_name || "",
          middleName: parsedUserData.middle_name || "",
          lastName: parsedUserData.last_name || "",
          email: parsedUserData.email || "",
          address1: parsedUserData.shipping_address_1 || "",
          address2: parsedUserData.shipping_address_2 || "",
          city: parsedUserData.shipping_address_city || "",
          state: parsedUserData.shipping_address_state || "",
          zipCode: parsedUserData.shipping_address_zip || "",
        });

        // If there's saved payment info, you could prefill it here too
        if (parsedUserData.card_number) {
          setPaymentInfo({
            cardNumber: parsedUserData.card_number || "",
            cardHolder: parsedUserData.card_name || "",
            expiryDate:
              parsedUserData.card_expire_month &&
              parsedUserData.card_expire_year
                ? `${parsedUserData.card_expire_month}/${parsedUserData.card_expire_year.toString().slice(-2)}`
                : "",
            cvv: "", // For security reasons, don't prefill CVV
          });
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCardNumber = (value) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "");
    // Add space after every 4 digits
    return digits
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "");
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentInfo((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }));
  };

  const handleExpiryDateChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setPaymentInfo((prev) => ({
      ...prev,
      expiryDate: formattedValue,
    }));
  };

  const handleSubmitCouponCode = async (e) => {
    const resetCoupon = () => {
      setCoupon({
        input: "",
        code: "",
        id: null,
        type: 0,
        value: 0
      });
    }
    try {
      e.preventDefault();
      let code = coupon.input;
      let res = await axios.get(
        `${import.meta.env.VITE_API_URL}/coupon/${code}/active`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = res.data.data;
      if (!data) {
        alert("Invalid Code.");
        resetCoupon();
      } else {
        setCoupon({
          input: "",
          code: data.code,
          id: data.id,
          type: data.type,
          value: data.value
        });
      }
    } catch(err) {
      if (err.response) {
        alert(err.response.data.message || "Error getting config");
      } else {
        alert("Network error. Please try again.");
      }
      resetCoupon();
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    console.log("🛒 Submitting order...");

    const token = localStorage.getItem("token");

    const [expMonth, expYearShort] = paymentInfo.expiryDate.split("/");
    const expYear = expYearShort ? `20${expYearShort}` : "";

    const orderData = {
      customer_first_name: shippingInfo.firstName,
      customer_middle_name: shippingInfo.middleName,
      customer_last_name: shippingInfo.lastName,
      customer_email: shippingInfo.email,
      coupon_id: coupon.id,
      shipping_address_1: shippingInfo.address1,
      shipping_address_2: shippingInfo.address2,
      shipping_address_city: shippingInfo.city,
      shipping_address_state: shippingInfo.state,
      shipping_address_zip: shippingInfo.zipCode,
      billing_address_1: shippingInfo.address1,
      billing_address_2: shippingInfo.address2,
      billing_address_city: shippingInfo.city,
      billing_address_state: shippingInfo.state,
      billing_address_zip: shippingInfo.zipCode,
      card_name: paymentInfo.cardHolder,
      card_number: paymentInfo.cardNumber.replace(/\s/g, ""),
      card_expire_month: expMonth,
      card_expire_year: expYear,
      card_code: paymentInfo.cvv,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const result = response.data;
      console.log("✅ Order response:", result);
      alert("✅ Order submitted successfully!");
      clearCart();
      navigate(`/`);
    } catch (err) {
      console.error("❌ Order submission failed:", err);

      if (err.response) {
        alert(err.response.data.message || "Error submitting order");
      } else {
        alert("Network error. Please try again.");
      }
    }
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
            <span>&times; {cartItem.quantity}</span>
          </div>
        </div>
      );
    });
  };

  // calculate total
  let total = {
    origin: 0,
    subscription: 0,
    coupon: 0,
    shipping: 0,
    saleTax: 0,
    final: 0
  };
  total.origin = parseFloat(getCartAmount());
  total.final = parseFloat(getCartAmount());
  // subscription
  if (isSubscription) {
    total.subscription = total.final * config.subscriptionDiscountPercentage;
    total.final = total.final - total.subscription;
  } else {
    total.subscription = 0;
  }
  // coupon
  switch(coupon.type) {
    case 0:
      total.coupon = total.final * coupon.value;
      total.final = total.final - total.coupon; 
      break;
    case 1:
      total.coupon = coupon.value;
      total.final = total.final - total.coupon; 
      break;
  }
  if (total.final < 0) {
    total.coupon = total.coupon + total.final;
    total.final = 0;
  }
  // shipping fee and sale tax
  total.shipping = config.shippingFee;
  total.final = total.final + total.shipping;
  total.saleTax = total.final * config.saleTax;
  total.final = total.final + total.saleTax;

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
                  <span>${total.origin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 font-bold">
                  <span>Subscription</span>
                  <span>${total.subscription.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 font-bold">
                  <span>Coupon</span>
                  <span>${total.coupon.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 font-bold">
                  <span>Shipping Fee</span>
                  <span>${total.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 font-bold">
                  <span>Sale Tax</span>
                  <span>${total.saleTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 font-bold">
                  <span>Total Final</span>
                  <span>${total.final.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Checkout Information Sections */}
        <div>
          {/* Shipping Information Section */}
          <div className="border rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Shipping Information</h2>
            </div>
            <div className="p-4">
              <form className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
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
                      onChange={handleShippingInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Middle Name
                    </label>
                    <input
                      id="middleName"
                      name="middleName"
                      className="w-full border rounded-md px-3 py-2"
                      value={shippingInfo.middleName}
                      onChange={handleShippingInputChange}
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
                      onChange={handleShippingInputChange}
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
                    onChange={handleShippingInputChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="address1"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address 1
                  </label>
                  <input
                    id="address1"
                    name="address1"
                    className="w-full border rounded-md px-3 py-2"
                    value={shippingInfo.address1}
                    onChange={handleShippingInputChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="address2"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address 2
                  </label>
                  <input
                    id="address2"
                    name="address2"
                    className="w-full border rounded-md px-3 py-2"
                    value={shippingInfo.address2}
                    onChange={handleShippingInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                      onChange={handleShippingInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      className="w-full border rounded-md px-3 py-2"
                      value={shippingInfo.state}
                      onChange={handleShippingInputChange}
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
                      onChange={handleShippingInputChange}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="border rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Coupon Information</h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmitCouponCode} className="flex mb-3">
                <div>
                  <input
                    id="couponCode"
                    name="couponCode"
                    placeholder="Code"
                    className="border rounded-md px-3 py-2"
                    value={coupon.input}
                    onChange={(e) => setCoupon((prev) => ({ ...prev, input: e.target.value}))}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 ml-3 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                >
                  Apply
                </button>
              </form>
              <div className="">
                {
                  coupon.code.trim() !== "" &&
                    <span className="bg-pink-200 p-2 rounded mr-2 text-md font-bold">
                      {coupon.code}
                    </span>
                }
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="border rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Payment Information</h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="w-full border rounded-md px-3 py-2"
                    value={paymentInfo.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardHolder"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Card Holder Name
                  </label>
                  <input
                    id="cardHolder"
                    name="cardHolder"
                    placeholder="John Doe"
                    className="w-full border rounded-md px-3 py-2"
                    value={paymentInfo.cardHolder}
                    onChange={handlePaymentInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expiry Date (MM/YY)
                    </label>
                    <input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      className="w-full border rounded-md px-3 py-2"
                      value={paymentInfo.expiryDate}
                      onChange={handleExpiryDateChange}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CVV
                    </label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="123"
                      className="w-full border rounded-md px-3 py-2"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentInputChange}
                      maxLength={4}
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
    </div>
  );
};

export default Checkout;
