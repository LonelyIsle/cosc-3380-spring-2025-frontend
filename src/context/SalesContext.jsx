import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SaleContext = createContext();
export const useSale = () => useContext(SaleContext);

const getToken = () => localStorage.getItem("token");
const URL_PATH = `${import.meta.env.VITE_API_URL}`;

export function SaleProvider({ children }) {
  // State to store the active sale event (e.g., the one currently active)
  const [activeSale, setActiveSale] = useState(null);
  // State to store the list of all sale events
  const [sales, setSales] = useState([]);
  const [salesLoaded, setSalesLoaded] = useState(false);

  // Prepare the authorization header using the stored token
  const token = getToken();
  const authHeader = { headers: { Authorization: token } };

  // Fetch the active sale event (GET sale-event/one/active)
  const fetchActiveSale = async () => {
    try {
      const res = await axios.get(`${URL_PATH}/sale-event/one/active`, authHeader);
      setActiveSale(res.data.data);
    } catch (err) {
      console.error("Failed to fetch active sale event:", err);
      setActiveSale(null);
    }
  };

  // Fetch all sale events (GET sale-event)
  const fetchSales = async () => {
    setSalesLoaded(false);
    try {
      const res = await axios.get(`${URL_PATH}/sale-event`, authHeader);
      // Map over rows to format the sale event data
      const mappedSales = res.data.data.rows.map((sale) => ({
        id: sale.id,
        coupon_id: sale.coupon_id,
        start_at: sale.start_at,
        end_at: sale.end_at,
        title: sale.title,
        description: sale.description,
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        deleted_at: sale.deleted_at,
        is_deleted: sale.is_deleted,
        coupon: sale.coupon,
      }));
      setSales(mappedSales);
    } catch (err) {
      console.error("Failed to fetch sale events:", err);
    } finally {
      setSalesLoaded(true);
    }
  };

  // Fetch a single sale event by ID (GET sale-event/:id)
  const fetchSaleById = async (id) => {
    try {
      const res = await axios.get(`${URL_PATH}/sale-event/${id}`, authHeader);
      return res.data.data;
    } catch (err) {
      console.error(`Failed to fetch sale event with id ${id}:`, err);
      throw err;
    }
  };


  // Create a new sale event (POST /sale-event)
  const createSaleEvent = async (data) => {
    try {
      // data should include: coupon_id, start_at, end_at, title, description.
      const res = await axios.post(`${URL_PATH}/sale-event`, data, authHeader);
      // Refresh the list of sale events after creation
      fetchSales();
      return res.data.data;
    } catch (err) {
      console.error("Failed to create sale event:", err);
      throw err;
    }
  };

  // Update an existing sale event (PATCH /sale-event/:id)
  const updateSaleEvent = async (id, data) => {
    try {
      // data should include updated values for coupon_id, start_at, end_at, title, description.
      const res = await axios.patch(
        `${URL_PATH}/sale-event/${id}`,
        data,
        authHeader,
      );
      fetchSales();
      return res.data.data;
    } catch (err) {
      console.error(`Failed to update sale event with id ${id}:`, err);
      throw err;
    }
  };

  // Delete a sale event (DEL /sale-event/:id)
  const deleteSaleEvent = async (id) => {
    try {
      await axios.delete(`${URL_PATH}/sale-event/${id}`, authHeader);
      fetchSales();
    } catch (err) {
      console.error(`Failed to delete sale event with id ${id}:`, err);
      throw err;
    }
  };

  // Fetch the sales data when the provider mounts
  useEffect(() => {
    fetchSales();
    fetchActiveSale();
  }, []);

  return (
    <SaleContext.Provider
      value={{
        activeSale,
        sales,
        salesLoaded,
        fetchActiveSale,
        fetchSales,
        fetchSaleById,
        createSaleEvent,
        updateSaleEvent,
        deleteSaleEvent,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
}

export default SaleContext;
