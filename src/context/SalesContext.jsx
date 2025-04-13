import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// create context
const SalesContext = createContext();

// custom hook to use the context
export const useSales = () => useContext(SalesContext);

// helper function to get the token from localStorage
