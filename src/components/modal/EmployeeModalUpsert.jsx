import { useEffect, useState } from "react";
import { useEmployee } from "@context/EmployeeContext";

const EmployeeModalUpsert = ({ employeeId = null, onClose }) => {
  const { createEmployee, updateEmployee, getEmployeeById } = useEmployee();
  const [employee, setEmployee] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    hourly_rate: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // If updating, fetch the employee data.
  useEffect(() => {
    if (employeeId !== null) {
      setLoading(true);
      const fetchEmployee = async () => {
        try {
          const data = await getEmployeeById(employeeId);
          setEmployee(data);
        } catch (err) {
          console.error("Error fetching employee:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [employeeId, getEmployeeById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employeeId === null) {
        // Creating a new employee (password is required here)
        const parsedRate = parseFloat(employee.hourly_rate);
        if (isNaN(parsedRate)) {
          alert("Please enter a valid number for Hourly Rate.");
          return;
        }
        await createEmployee({
          ...employee,
          hourly_rate: parsedRate,
        });
      } else {
        await updateEmployee(employeeId, {
          first_name: employee.first_name,
          middle_name: employee.middle_name,
          last_name: employee.last_name,
          email: employee.email,
          hourly_rate: parseFloat(employee.hourly_rate),
        });
      }
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Operation failed. Please try again.");
      }
    }
  };

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
        <h2 className="text-xl font-semibold mb-4">
          {employeeId ? "Update Employee" : "Add New Employee"}
        </h2>
        {loading ? (
          <p className="text-overlay1">Loading employee...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={employee.first_name || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                placeholder="Middle Name"
                value={employee.middle_name || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={employee.last_name || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={employee.email || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Hourly Rate</label>
              <input
                type="number"
                step="0.01"
                name="hourly_rate"
                placeholder="Hourly Rate"
                value={employee.hourly_rate || ""}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />
            </div>
            {/* Only include the password field when creating a new employee */}
            {!employeeId && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={employee.password || ""}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-surface1 text-text"
                  required
                />
              </div>
            )}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green rounded hover:bg-teal transition text-black"
              >
                {employeeId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmployeeModalUpsert;
