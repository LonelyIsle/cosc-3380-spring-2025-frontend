import { useEmployee } from "@context/EmployeeContext";
import { useState, useEffect } from "react";
import EmployeeModalUpsert from "@modal/EmployeeModalUpsert";
import DeleteEmployeeModal from "@modal/DeleteEmployeeModal";
import EmployeePasswordModal from "@modal/EmployeePasswordModal";

const Employee = () => {
  const { employees, deleteEmployee } = useEmployee();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [deleteEmployeeTarget, setDeleteEmployeeTarget] = useState(null);
  const [passwordModalTarget, setPasswordModalTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");

  const openUpsertModal = (employeeId = null) => {
    setSelectedEmployeeId(employeeId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEmployeeId(null);
  };

  // Close any open modal when the escape key is pressed.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setSelectedEmployeeId(null);
        setDeleteEmployeeTarget(null);
        setPasswordModalTarget(null);
      }
    };

    const shouldListen =
      modalOpen ||
      deleteEmployeeTarget !== null ||
      passwordModalTarget !== null;

    if (shouldListen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, deleteEmployeeTarget, passwordModalTarget]);

  // Filter and sort the employee list.
  const filteredEmployees = employees
    .filter(
      (emp) =>
        emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (typeof a[sortKey] === "string")
        return a[sortKey].localeCompare(b[sortKey]);
      return a[sortKey] - b[sortKey];
    });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
        <button
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => openUpsertModal(null)}
        >
          + Add New Employee
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <select
          onChange={(e) => setSortKey(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
          <option value="email">Email</option>
          <option value="hourly_rate">Hourly Rate</option>
        </select>
      </div>
      <table className="w-full border border-black bg-gray-200">
        <thead>
          <tr className="bg-gray-400 border-black text-black">
            <th className="p-2 text-center border">ID</th>
            <th className="p-2 text-center border">First Name</th>
            <th className="p-2 text-center border">Middle Name</th>
            <th className="p-2 text-center border">Last Name</th>
            <th className="p-2 text-center border">Email</th>
            <th className="p-2 text-center border">Hourly Rate</th>
            <th className="p-2 text-center border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, index) => (
            <tr
              key={emp.id}
              className={index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"}
            >
              <td className="p-2 text-center border">{emp.id}</td>
              <td className="p-2 text-center border">{emp.first_name}</td>
              <td className="p-2 text-center border">
                {emp.middle_name || "-"}
              </td>
              <td className="p-2 text-center border">{emp.last_name}</td>
              <td className="p-2 text-center border">{emp.email}</td>
              <td className="p-2 text-center border">
                ${parseFloat(emp.hourly_rate).toFixed(2)}
              </td>
              <td className="p-2 text-center border">
                <button
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => openUpsertModal(emp.id)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => setPasswordModalTarget(emp)}
                >
                  Update Password
                </button>
                <button
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setDeleteEmployeeTarget(emp)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <EmployeeModalUpsert
          employeeId={selectedEmployeeId}
          onClose={closeModal}
        />
      )}
      {deleteEmployeeTarget && (
        <DeleteEmployeeModal
          employee={deleteEmployeeTarget}
          onCancel={() => setDeleteEmployeeTarget(null)}
          onConfirm={async () => {
            try {
              await deleteEmployee(deleteEmployeeTarget.id);
              setDeleteEmployeeTarget(null);
            } catch (err) {
              console.error("Failed to delete employee:", err);
              alert("Failed to delete employee.");
            }
          }}
        />
      )}
      {passwordModalTarget && (
        <EmployeePasswordModal
          employee={passwordModalTarget}
          onCancel={() => setPasswordModalTarget(null)}
          onConfirm={() => setPasswordModalTarget(null)}
        />
      )}
    </div>
  );
};

export default Employee;
