import { useState, useEffect } from "react";
import OrderHistory from "@ui/OrderHistory";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isSecretModalOpen, setSecretModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const [orderHistory, setOrderHistory] = useState([]);
  const [changePasswordData, setChangePasswordData] = useState({
    password: ""
  });
  const [changeQAData, setChangeQAData] = useState({
    reset_password_question: "",
	  reset_password_answer: ""
  });
  const [basicInfo, setBasicInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
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

  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const parsedUserData = JSON.parse(userData);

      if (!token || !parsedUserData || !parsedUserData.id) {
        throw new Error("Missing token or user data");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/customer/${parsedUserData.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      let data = res.data.data;
      setProfileData(data); 
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      setError(err.message || "Failed to fetch profile data");
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const parsedUserData = JSON.parse(userData);

      if (!token || !parsedUserData || !parsedUserData.id) {
        throw new Error("Missing token or user data");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/order?sort_by=created_at-desc`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setOrderHistory(res.data.data.rows);
    } catch (err) {
      setError(err.message || "Failed to fetch order data");
      console.error("Error fetching order data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchOrderHistory();
  }, []);

  const handleOpenUpdateModal = () => {
    setBasicInfo({
      firstName: profileData.first_name,
      middleName: profileData.middle_name,
      lastName: profileData.last_name,
      address1: profileData.shipping_address_1,
      address2: profileData.shipping_address_2,
      city: profileData.shipping_address_city,
      state: profileData.shipping_address_state,
      zipCode: profileData.shipping_address_zip,
    });
    setPaymentInfo({
      cardNumber: profileData.card_number,
      cardHolder: profileData.card_name,
      expiryDate: 
        profileData.card_expire_month &&
        profileData.card_expire_year
          ? `${profileData.card_expire_month}/${profileData.card_expire_year.toString().slice(-2)}`
          : "",
      cvv: "",
    });
    setUpdateModalOpen(true);
  }

  const handleUpdate = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  const handleBasicInfoInputChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({
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

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const parsedUserData = JSON.parse(userData);

      if (!token || !parsedUserData || !parsedUserData.id) {
        throw new Error("Missing token or user data");
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/customer/${parsedUserData.id}/password`,
        {
          password: changePasswordData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setChangePasswordData({
        password: ""
      });
      alert("✅ Saved!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to fetch order data");
      console.error("Error fetching order data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleChangeQA = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const parsedUserData = JSON.parse(userData);

      if (!token || !parsedUserData || !parsedUserData.id) {
        throw new Error("Missing token or user data");
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/customer/${parsedUserData.id}/qa`,
        {
          reset_password_question: changeQAData.reset_password_question,
          reset_password_answer: changeQAData.reset_password_answer
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setChangeQAData({
        reset_password_question: "",
	      reset_password_answer: ""
      });
      setSecretModalOpen(false);
      alert("✅ Saved!");
    } catch (err) {
      setError(err.message || "Failed to fetch order data");
      console.error("Error fetching order data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      const parsedUserData = JSON.parse(userData);

      if (!token || !parsedUserData || !parsedUserData.id) {
        throw new Error("Missing token or user data");
      }

      const [expMonth, expYearShort] = paymentInfo.expiryDate.split("/");
      const expYear = expYearShort ? `20${expYearShort}` : "";
      const updateData = {
        first_name: basicInfo.firstName,
        middle_name: basicInfo.middleName,
        last_name: basicInfo.lastName,
        shipping_address_1: basicInfo.address1,
        shipping_address_2: basicInfo.address2,
        shipping_address_city: basicInfo.city,
        shipping_address_state: basicInfo.state,
        shipping_address_zip: basicInfo.zipCode,
        billing_address_1: basicInfo.address1,
        billing_address_2: basicInfo.address2,
        billing_address_city: basicInfo.city,
        billing_address_state: basicInfo.state,
        billing_address_zip: basicInfo.zipCode,
        card_name: paymentInfo.cardHolder,
        card_number: paymentInfo.cardNumber.replace(/\s/g, ""),
        card_expire_month: expMonth,
        card_expire_year: expYear,
        card_code: paymentInfo.cvv
      };

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/customer/${parsedUserData.id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(res.data.data));
      alert("✅ Saved!");
      window.location.reload();
    } catch (err) {
      setError(err.message || "Failed to fetch order data");
      console.error("Error fetching order data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Profile data not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-indigo-600 text-white py-12 px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">{`${profileData.first_name}${profileData.middle_name ? " " + profileData.middle_name +  " " : " "}${profileData.last_name}`}</h2>
            <p className="text-lg mt-1">Mofu Shopper</p>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Profile Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="block mb-1 text-gray-700">Email:</strong>
              <span className="text-gray-600">{profileData.email}</span>
              <div className="mt-3">
                <strong className="block mb-1 text-gray-700">
                  Subscribed :
                </strong>
                <span className="text-gray-600">
                  {profileData.subscription
                    ? `Subscribed - ${new Date(profileData.subscription.start_at).toLocaleDateString("en-us")} to ${new Date(profileData.subscription.end_at).toLocaleDateString("en-us")}`
                    : (
                      <button
                        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                        onClick={() => navigate("/subscription")}
                      >
                        Buy Subscription
                      </button>
                    )
                  }
                </span>
              </div>
            </div>
            <div>
              {(
                  <div>
                    <strong className="block text-gray-700">
                      Shipping Address:
                    </strong>
                    <div className="text-gray-600">
                      Address 1: {profileData.shipping_address_1 ? profileData.shipping_address_1 : "N/A"}
                    </div>
                    <div className="text-gray-600">
                      Address 2: {profileData.shipping_address_1 ? profileData.shipping_address_2 : "N/A"}
                    </div>
                    <div className="text-gray-600">
                      City: {profileData.shipping_address_city ? profileData.shipping_address_city : "N/A"}
                    </div>
                    <div className="text-gray-600">
                      State: {profileData.shipping_address_state ? profileData.shipping_address_state : "N/A"}
                    </div>
                    <div className="text-gray-600">
                      Zip: {profileData.shipping_address_zip ? profileData.shipping_address_zip : "N/A"}
                    </div>
                  </div>
                )
              }
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800">
            Past Order History
          </h3>
          <div className="border-t pt-1">
            <OrderHistory orders={orderHistory} />
          </div>
        </div>
        <div className="flex justify-between p-6 border-t bg-gray-50">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            onClick={() => setPasswordModalOpen(true)}
          >
            Change Password
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setSecretModalOpen(true)}
          >
            Change Secret Question
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={handleOpenUpdateModal}
          >
            Update Information
          </button>
        </div>
      </div>

      <Dialog
        open={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setChangePasswordData({ password: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex mt-1 justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setPasswordModalOpen(false)}
              >
                Cancel
              </button>
              <button onClick={handleChangePassword} className="px-4 py-2 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Update Modal */}
      <Dialog
        open={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-150">
            <div>
              <div className="space-y-2">
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
                      value={basicInfo.firstName}
                      onChange={handleBasicInfoInputChange}
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
                      value={basicInfo.middleName}
                      onChange={handleBasicInfoInputChange}
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
                      value={basicInfo.lastName}
                      onChange={handleBasicInfoInputChange}
                      required
                    />
                  </div>
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
                    value={basicInfo.address1}
                    onChange={handleBasicInfoInputChange}
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
                    value={basicInfo.address2}
                    onChange={handleBasicInfoInputChange}
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
                      value={basicInfo.city}
                      onChange={handleBasicInfoInputChange}
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
                      value={basicInfo.state}
                      onChange={handleBasicInfoInputChange}
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
                      value={basicInfo.zipCode}
                      onChange={handleBasicInfoInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
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
              </div>
            </div>
            <div className="flex mt-3 justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setUpdateModalOpen(false)}
              >
                Cancel
              </button>
              <button onClick={handleUpdateInfo} className="px-4 py-2 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Change Secret Question Modal */}
      <Dialog
        open={isSecretModalOpen}
        onClose={() => setSecretModalOpen(false)}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Change Secret Question
            </h2>
            <input
              type="text"
              placeholder="Your New Question"
              onChange={(e) => setChangeQAData((prev) => ({...prev, reset_password_question: e.target.value}))}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              placeholder="Your Answer"
              onChange={(e) => setChangeQAData((prev) => ({...prev, reset_password_answer: e.target.value}))}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setSecretModalOpen(false)}
              >
                Cancel
              </button>
              <button onClick={handleChangeQA} className="px-4 py-2 bg-green-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {showSavedMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
          Changes Saved
        </div>
      )}
    </div>
  );
}

export default Profile;
