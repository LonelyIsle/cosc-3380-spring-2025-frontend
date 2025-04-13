import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCustomerModal = ({ customerId, onClose }) => {
  const [data, setData] = useState([]);

  const getData = async (id) => {
    try {
        let url = `${import.meta.env.VITE_API_URL}/customer/${customerId}`;
        const token = localStorage.getItem("token");
        const res = await axios.get(url, {
            headers: {
                Authorization: token,
            }
        });
        let data = res.data.data;
        setData(data);
    } catch(e) {
        alert(e.message);
    }
  };

  useEffect(() => {
    if (customerId) {
      getData()
    }
  }, [customerId]);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(24, 24, 37, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="bg-surface0 text-text p-6 rounded-2xl shadow-lg w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex mb-3">
          <div>
            <label className="font-semibold bl">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              value={data.first_name}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
          <div className="ml-3">
            <label className="font-semibold bl">Middle Name</label>
            <input
              type="text"
              placeholder="Middle Name"
              value={data.middle_name}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
          <div className="ml-3">
            <label className="font-semibold bl">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              value={data.last_name}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
        </div>
        <div className="flex mb-3">
          <div className="grow">
            <label className="font-semibold bl">Email</label>
            <input
              type="text"
              placeholder="Email"
              value={data.email}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
        </div>
        <div className="flex mb-3">
          <div className="">
            <label className="font-semibold bl">Subscription</label>
            <div className="mt-2 text-center">
              { data.subscription  
                  ? <span className="bg-green-200 p-2 rounded mr-2 text-md font-bold text-black">
                      yes
                  </span>
                  :<span className="bg-gray-200 p-2 rounded mr-2 text-md font-bold text-black">
                      no
                  </span>
              }
            </div>
          </div>
          <div className="ml-3">
            <label className="font-semibold bl">Start At</label>
            <input
              type="text"
              placeholder="Start At"
              value={data.subscription ? new Date(data.subscription.start_at).toLocaleDateString("en-us") : "N/A"}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
          <div className="ml-3">
            <label className="font-semibold bl">End At</label>
            <input
              type="text"
              placeholder="End At"
              value={data.subscription ? new Date(data.subscription.end_at).toLocaleDateString("en-us") : "N/A"}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
        </div>
        <div className="flex mb-3">
          <div>
            <label className="font-semibold bl">Address 1</label>
            <input
              type="text"
              placeholder="Address 1"
              value={data.shipping_address_2 ? data.shipping_address_2 : "N/A"}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
          <div className="ml-3">
            <label className="font-semibold bl">Address 2</label>
            <input
              type="text"
              placeholder="Address 2"
              value={data.shipping_address_2 ? data.shipping_address_2 : "N/A"}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
        </div>
        <div className="flex mb-6">
          <div>
            <label className="font-semibold bl">City</label>
            <input
              type="text"
              placeholder="City"
              value={data.shipping_address_city ? data.shipping_address_city : "N/A"}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
          <div className="ml-3">
            <label className="font-semibold bl">State</label>
            <input
              type="text"
              placeholder="State"
              value={data.shipping_address_state ? data.shipping_address_state : "N/A"}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
          <div className="ml-3">
            <label className="font-semibold bl">Zip Code</label>
            <input
              type="text"
              placeholder="Zip Code"
              value={data.shipping_address_zip ? data.shipping_address_zip : "N/A"}
              disabled={true}
              className="w-full p-2 rounded bg-surface1 text-text"
            />
          </div>
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerModal;
