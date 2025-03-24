import OrderHistory from "../components/OrderHistory";

function Profile() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-indigo-600 text-white py-12 px-4 sm:px-6">
          <div className="text-center">
            <img
              className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-white"
              src="" // Replace with actual profile picture
              alt="Profile"
            />
            <h2 className="text-3xl font-semibold">John Middle Doe</h2>
            <p className="text-lg mt-1">Mofu Shopper</p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-15">
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
                <strong className="block mb-1 text-gray-700">Member Status:</strong>
                <span className="text-gray-600">Subscribed</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Past Order History
            </h3>
            <div className="border-t pt-4">
              <OrderHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;