import { useState } from "react";
import { useEmployee } from "../context/EmployeeContext";

const EmployeePasswordModal = ({ employee, onCancel, onConfirm }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateEmployeePassword } = useEmployee();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (newPassword.trim() === "") {
      alert("Password cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      await updateEmployeePassword(employee.id, newPassword);
      onConfirm(); // Close modal on success
    } catch (err) {
      console.error("Failed to update password:", err);
      alert("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(24, 24, 37, 0.7)" }}
      onClick={onCancel}
    >
      <div
        className="bg-surface0 text-text p-6 rounded-2xl shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          Update Password for {employee.first_name} {employee.last_name}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded bg-surface1 text-text"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded bg-surface1 text-text"
              required
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green rounded hover:bg-teal transition text-black"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeePasswordModal;
