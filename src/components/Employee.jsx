import React, { useEffect, useState } from "react";
import axios from "axios";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/employee/:id`,
        );
        setEmployees(response.data.rows || []);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table className="w-full border border-black bg-gray-200">
          <thead>
            <tr className="bg-gray-400 text-white">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr
                key={emp.id}
                className={index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"}
              >
                <td className="p-2 border">{emp.id}</td>
                <td className="p-2 border">{emp.name}</td>
                <td className="p-2 border">{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employee;
