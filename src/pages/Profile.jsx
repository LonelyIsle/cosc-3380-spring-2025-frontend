import OrderHistory from "../components/OrderHistory";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-semibold">John Middle Doe</h2>
          <p className="text-gray-600">Mofu + Member</p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Email: john.doe@example.com</li>
              <li>Phone: +1 123-456-7890</li>
              <li>Address: 11722 random lane </li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Past Order History</h3>
            <OrderHistory />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
