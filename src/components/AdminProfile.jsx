import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminProfile = () => {
	const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    id: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: 0,
    hourlyRate: 0
  });

	const [password, setPassword] = useState("");

  const getEmployee = async () => {
    try {
			const token = localStorage.getItem("token");
			const userData = localStorage.getItem("user");
			const parsedUserData = JSON.parse(userData);

      let res = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee/${parsedUserData.id}`,
        {
          headers: {
            "Content-Type": "application/json",
						"Authorization": token
          },
        }
      );
      let data = res.data.data;
      setEmployee({
        id: data.id,
        firstName: data.first_name,
        middleName: data.middle_name,
        lastName: data.last_name,
				email: data.email,
				role: data.role,
				hourlyRate: data.hourly_rate
      });

			// set user
      localStorage.setItem("user", JSON.stringify(data));
      
    } catch(err) {
      if (err.response) {
        alert(err.response.data.message || "Error getting employee");
      } else {
        alert("Network error. Please try again.");
      }
    }
  }

  useEffect(() => {
    getEmployee();
  }, []);


  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
		const userData = localStorage.getItem("user");
		const parsedUserData = JSON.parse(userData);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/employee/${parsedUserData.id}/password`, {
          password: password
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      alert("✅ Saved!");
			navigate("/admin/login");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Error saving config.");
      } else {
        alert("Network error. Please try again.");
      }
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Config</h2>
      </div>
      <div className="grid grid-cols-4">
        <div className="mt-4 col-span-2">
          <div className="flex">
            <div>
							<label className="font-semibold bl">First Name</label>
							<input
								type="text"
								placeholder="First Name"
								value={employee.firstName}
								disabled={true}
								className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
							/>
						</div>
						<div className="ml-2">
							<label className="font-semibold bl">Middle Name</label>
							<input
								type="text"
								placeholder="Middle Name"
								value={employee.middleName}
								disabled={true}
								className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
							/>
						</div>
						<div className="ml-2">
							<label className="font-semibold bl">Last Name</label>
							<input
								type="text"
								placeholder="Last Name"
								value={employee.lastName}
								disabled={true}
								className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
							/>
						</div>
          </div>
          <div>
            <label className="font-semibold bl">Email</label>
            <input
              type="text"
              placeholder="Email"
              value={employee.email}
							disabled={true}
              className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
            />
          </div>
          <div>
            <label className="font-semibold bl">Hourly Rate</label>
            <input
              type="text"
              placeholder="Hourly Rate"
              value={`$${employee.hourlyRate.toFixed(2)}`}
							disabled={true}
              className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
            />
          </div>
          <div>
            <label className="font-semibold bl">Change Passwordt</label>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-black rounded bg-white text-black mt-2 mb-2"
            />
          </div>
          <div className="text-center">
            <button
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
              onClick={handleChangePassword}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
