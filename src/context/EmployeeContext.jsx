import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create the EmployeeContext
const EmployeeContext = createContext();

// Custom hook to access EmployeeContext
export const useEmployee = () => useContext(EmployeeContext);

// Provider component
export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [employeesLoaded, setEmployeesLoaded] = useState(false);

  ///////////////////////////
  // EMPLOYEE API CALLS   //
  ///////////////////////////

  // 1. GET /employee - Fetch list of employees
  const fetchEmployees = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/employee`;
      const res = await axios.get(url);
      const mappedEmployees = res.data.data.rows.map((emp) => ({
        id: emp.id,
        first_name: emp.first_name,
        middle_name: emp.middle_name,
        last_name: emp.last_name,
        email: emp.email,
        role: emp.role,
        hourly_rate: emp.hourly_rate,
        created_at: emp.created_at,
        updated_at: emp.updated_at,
        deleted_at: emp.deleted_at,
        is_deleted: emp.is_deleted,
      }));
      setEmployees(mappedEmployees);
      setEmployeesLoaded(true);
    } catch (err) {
      console.error("Failed to fetch employees:", err.response?.data || err.message);
      setEmployeesLoaded(true);
    }
  };

  // Fetch employees on initial render
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. GET /employee/:id - Get a single employee's details
  const getEmployeeById = async (id) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/employee/${id}`;
      const res = await axios.get(url);
      return res.data.data;
    } catch (err) {
      console.error("Failed to fetch employee:", err.response?.data || err.message);
      throw err;
    }
  };

  // 3. POST /employee/login - Employee authentication
  const loginEmployee = async (email, password) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/employee/login`;
      const res = await axios.post(url, { email, password });
      
      // If the response contains an auth token, you may want to store it
      const token = res.data.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      return res.data.data;
    } catch (err) {
      console.error("Employee login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // 4. POST /employee - Create a new employee
  const createEmployee = async (employeeData) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/employee`;
      const res = await axios.post(url, employeeData);
      const newEmployee = res.data.data;
      // Update local state by adding the new employee
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      console.error("Failed to create employee:", err.response?.data || err.message);
      throw err;
    }
  };

  // 5. PATCH /employee/:id - Update employee details
  const updateEmployee = async (id, employeeData) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/employee/${id}`;
      const token = localStorage.getItem("token");
      const res = await axios.patch(url, employeeData, {
        headers: {
          Authorization: token,
        },
      });
      const updatedEmployee = res.data.data;
      // Update local state with the updated employee information
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );
      return updatedEmployee;
    } catch (err) {
      console.error("Failed to update employee:", err.response?.data || err.message);
      throw err;
    }
  };

  // 6. PATCH /employee/:id/password - Update employee password
  const updateEmployeePassword = async (id, password) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/employee/${id}/password`;
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        url,
        { password },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return res.data.data;
    } catch (err) {
      console.error("Failed to update employee password:", err.response?.data || err.message);
      throw err;
    }
  };

  // 7. DELETE /employee/:id - Remove an employee
  const deleteEmployee = async (id) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/employee/${id}`;
      const token = localStorage.getItem("token");
      await axios.delete(url, {
        headers: {
          Authorization: token,
        },
      });
      // Remove deleted employee from state
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("Failed to delete employee:", err.response?.data || err.message);
      throw err;
    }
  };

  ////////////////////////////////
  // PROVIDER VALUE & COMPONENT //
  ////////////////////////////////

  return (
    <EmployeeContext.Provider
      value={{
        // Employee list and loaded state
        employees,
        employeesLoaded,
        // API methods
        fetchEmployees,
        getEmployeeById,
        loginEmployee,
        createEmployee,
        updateEmployee,
        updateEmployeePassword,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export default EmployeeContext;
