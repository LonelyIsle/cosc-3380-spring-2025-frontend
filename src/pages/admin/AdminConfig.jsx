import { useEffect, useState } from "react";
import axios from "axios";

const Config = () => {
  const [config, setConfig] = useState({
    shippingFee: 0,
    saleTax: 0,
    subscriptionPrice: 0,
    subscriptionDiscountPercentage: 0,
  });

  const getConfig = async () => {
    try {
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/config`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = res.data.data;
      setConfig({
        shippingFee: data.shipping_fee,
        saleTax: data.sale_tax,
        subscriptionPrice: data.subscription_price,
        subscriptionDiscountPercentage: data.subscription_discount_percentage,
      });
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Error getting config");
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveConfig = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/config`,
        {
          shipping_fee: config.shippingFee,
          sale_tax: config.saleTax,
          subscription_price: config.subscriptionPrice,
          subscription_discount_percentage:
            config.subscriptionDiscountPercentage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );
      alert("✅ Saved!");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Error saving config.");
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Config</h2>
      </div>
      <div className="grid grid-cols-4">
        <div className="mt-4 col-span-2">
          <div>
            <label className="font-semibold bl">Shipping Fee</label>
            <input
              type="number"
              name="shippingFee"
              placeholder="Shipping Fee"
              value={config.shippingFee}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
            />
          </div>
          <div>
            <label className="font-semibold bl">Sale Tax</label>
            <input
              type="number"
              name="saleTax"
              placeholder="Sale Tax"
              value={config.saleTax}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
            />
          </div>
          <div>
            <label className="font-semibold bl">Subscription Price</label>
            <input
              type="number"
              name="subscriptionPrice"
              placeholder="Subscription Price"
              value={config.subscriptionPrice}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
            />
          </div>
          <div>
            <label className="font-semibold bl">Subscription Discount</label>
            <input
              type="number"
              name="subscriptionDiscountPercentage"
              placeholder="Subscription Discount"
              value={config.subscriptionDiscountPercentage}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
            />
          </div>
          <div className="text-center">
            <button
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
              onClick={handleSaveConfig}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;
