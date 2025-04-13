import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// create context
const SalesContext = createContext();

// custom hook to use the context
export const useSales = () => useContext(SalesContext);

// helper function to get the token from localStorage
const getToken = () => localStorage.getItem("token");

const URL_PATH = `${import.meta.env.VITE_API_URL}`;

export function SalesProvider({ children }) {
  const [sales, setSales] = useState([]);
  const [salesLoaded, setSalesLoaded] = useState(false);
}
