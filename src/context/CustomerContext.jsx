import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CustomerContext = createContext();
export const useCustomer = () => useContext(CustomerContext);
const getToken = () => localStorage.getItem("token");
const URL_PATH = `${import.meta.env.VITE_API_URL}`;

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [customersLoaded, setCustomersLoaded] = useState(false);

  // Authorization header for requests that require auth
  const token = getToken();
  const authHeader = { headers: { Authorization: token } };

  // Fetch all customers (GET customer)
  const fetchCustomers = async () => {
    setCustomersLoaded(false);
    try {
      const res = await axios.get(`${URL_PATH}/customer`, authHeader);
      const mappedCustomers = res.data.data.rows.map((customer) => ({
        ...customer,
      }));
      setCustomers(mappedCustomers);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setCustomersLoaded(true);
    }
  };

  // Fetch a specific customer by id (GET customer/:id)
  const fetchCustomerById = async (id) => {
    try {
      const res = await axios.get(`${URL_PATH}/customer/${id}`, authHeader);
      return res.data.data;
    } catch (err) {
      console.error(`Failed to fetch customer with id ${id}:`, err);
      throw err;
    }
  };

  // Register a new customer (POST register)
  const registerCustomer = async (data) => {
    // data: { first_name, middle_name, last_name, email, password, reset_password_question, reset_password_answer }
    try {
      const res = await axios.post(`${URL_PATH}/register`, data, authHeader);
      // Refresh the customer list after registration if needed
      fetchCustomers();
      return res.data.data;
    } catch (err) {
      console.error("Failed to register customer:", err);
      throw err;
    }
  };

  // Login a customer (POST login)
  const loginCustomer = async (email, password) => {
    try {
      const res = await axios.post(`${URL_PATH}/login`, { email, password }, authHeader);
      // If the response contains an auth token, store it in localStorage
      const token = res.data.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      return res.data.data;
    } catch (err) {
      console.error("Failed to login customer:", err);
      throw err;
    }
  };

  // Get the reset password question for a given customer (POST forget/question)
  const forgetQuestion = async (email) => {
    try {
      const res = await axios.post(`${URL_PATH}/forget/question`, { email }, authHeader);
      return res.data.data;
    } catch (err) {
      console.error("Failed to get password reset question:", err);
      throw err;
    }
  };

  // Reset password (POST forget)
  const forgetPassword = async (data) => {
    // data: { email, reset_password_answer, password }
    try {
      const res = await axios.post(`${URL_PATH}/forget`, data, authHeader);
      return res.data.data;
    } catch (err) {
      console.error("Failed to reset password:", err);
      throw err;
    }
  };

  // Create a customer subscription (POST customer/subscription)
  const createSubscription = async (data) => {
    // data: { billing_address_1, billing_address_2, billing_address_city, billing_address_state, billing_address_zip,
    //         card_name, card_number, card_expire_month, card_expire_year, card_code }
    try {
      const res = await axios.post(
        `${URL_PATH}/customer/subscription`,
        data,
        authHeader,
      );
      // Optionally refresh the customers list to update subscription data
      fetchCustomers();
      return res.data.data;
    } catch (err) {
      console.error("Failed to create subscription:", err);
      throw err;
    }
  };

  // Update customer information (PATCH customer/:id)
  const updateCustomer = async (id, data) => {
    // data may include updated names, shipping and billing addresses, and card information
    try {
      const res = await axios.patch(
        `${URL_PATH}/customer/${id}`,
        data,
        authHeader,
      );
      // Refresh customers list after update
      fetchCustomers();
      return res.data.data;
    } catch (err) {
      console.error(`Failed to update customer with id ${id}:`, err);
      throw err;
    }
  };

  // Update customer password (PATCH customer/:id/password)
  const updateCustomerPassword = async (id, password) => {
    try {
      const res = await axios.patch(
        `${URL_PATH}/customer/${id}/password`,
        { password },
        authHeader,
      );
      return res.data.data;
    } catch (err) {
      console.error(
        `Failed to update password for customer with id ${id}:`,
        err,
      );
      throw err;
    }
  };

  // Update customer's reset password question and answer (PATCH customer/:id/qa)
  const updateCustomerQA = async (id, data) => {
    // data: { reset_password_question, reset_password_answer }
    try {
      const res = await axios.patch(
        `${URL_PATH}/customer/${id}/qa`,
        data,
        authHeader,
      );
      return res.data.data;
    } catch (err) {
      console.error(`Failed to update customer QA for id ${id}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        customersLoaded,
        fetchCustomers,
        fetchCustomerById,
        registerCustomer,
        loginCustomer,
        forgetQuestion,
        forgetPassword,
        createSubscription,
        updateCustomer,
        updateCustomerPassword,
        updateCustomerQA,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export default CustomerContext;
