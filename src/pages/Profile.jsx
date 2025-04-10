import { useState } from "react";
import OrderHistory from "../components/OrderHistory";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";

function Profile() {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isSecretModalOpen, setSecretModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const orders = [
    {
      id: "123456",
      date: "2025-04-01",
      total: "49.99",
      items: [
        { name: "Anime Plushie", quantity: 1 },
        { name: "Super Hero Plushie", quantity: 2 },
      ],
    },
    {
      id: "123457",
      date: "2025-03-15",
      total: "29.99",
      items: [
        { name: "Cartoon Plushie", quantity: 1 },
        { name: "Red Plushie", quantity: 3 },
      ],
    },
    {
      id: "123457",
      date: "2025-03-15",
      total: "29.99",
      items: [
        { name: "Disney Plushie", quantity: 1 },
        { name: "Blue Plushie", quantity: 3 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-indigo-600 text-white py-12 px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">John Middle Doe</h2>
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
              <span className="text-gray-600">john.doe@example.com</span>
            </div>
            <div>
              <strong className="block mb-1 text-gray-700">Phone:</strong>
              <span className="text-gray-600">+1 123-456-7890</span>
            </div>
            <div>
              <strong className="block mb-1 text-gray-700">Address:</strong>
              <span className="text-gray-600">11722 Random Lane</span>
            </div>
            <div>
              <strong className="block mb-1 text-gray-700">
                Member Status:
              </strong>
              <span className="text-gray-600">Subscribed</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800">
            Past Order History
          </h3>
          <div className="border-t pt-4">
            <OrderHistory orders={orders} />
          </div>
        </div>

        <div className="flex justify-between p-6 border-t bg-gray-50">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => console.log("Profile Saved")}
          >
            Save
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            onClick={() => setPasswordModalOpen(true)}
          >
            Change Password
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={() => setSecretModalOpen(true)}
          >
            Change Secret Question
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
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
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setPasswordModalOpen(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
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
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              placeholder="Your Answer"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setSecretModalOpen(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Profile;
