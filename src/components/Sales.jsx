import { useEffect, useState, useCallback } from "react";

const Sales = () => {
  const [allSales, setAllSales] = useState([]);

  const fetchAllSales = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Sending token:", token);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sale-event`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to fetch sales");
      const result = await response.json();
      console.log("Fetched sales:", result.data);
      setAllSales(result.data || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setAllSales([]);
    }
  }, []);

  useEffect(() => {
    fetchAllSales();
  }, [fetchAllSales]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sales</h2>
      <p>Check console for fetched sales data.</p>
    </div>
  );
};

export default Sales;
