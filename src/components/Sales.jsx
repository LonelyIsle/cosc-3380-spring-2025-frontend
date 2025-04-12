import { format } from "date-fns";
import { useEffect, useState } from "react";

const Sales = () => {
  const [sale, setSale] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  useEffect(() => {
    if (!selectedStartDate && !selectedEndDate) return;

    const params = new URLSearchParams();
    if (selectedStartDate) params.append("start", selectedStartDate);
    if (selectedEndDate) params.append("end", selectedEndDate);

    const fetchSale = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/sale-event/one/active?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch sale");
        const result = await response.json();
        const data = result.data;
        setSale({
          id: data.id,
          title: data.title,
          startAt: data.start_at,
          endAt: data.end_at,
        });
      } catch (error) {
        console.error("Error fetching sale:", error);
        setSale(null);
      }
    };

    fetchSale();
  }, [selectedStartDate, selectedEndDate]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Active Sales</h2>
      <div className="mb-4">
        <label htmlFor="sale-start-date" className="mr-2 font-medium">Select Start Date:</label>
        <input
          type="date"
          id="sale-start-date"
          value={selectedStartDate}
          onChange={(e) => setSelectedStartDate(e.target.value)}
          className="border p-1 rounded mr-4"
        />
        <label htmlFor="sale-end-date" className="mr-2 font-medium">Select End Date:</label>
        <input
          type="date"
          id="sale-end-date"
          value={selectedEndDate}
          onChange={(e) => setSelectedEndDate(e.target.value)}
          className="border p-1 rounded"
        />
      </div>
      {sale ? (
        <div className="sale-card">
          <h3 className="text-lg font-semibold text-center mb-2">{sale.title}</h3>
          <table className="w-full border border-black bg-gray-200">
            <thead>
              <tr className="bg-gray-400 text-white">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Start</th>
                <th className="p-2 border">End</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="p-2 border">{sale.title}</td>
                <td className="p-2 border">{format(new Date(sale.startAt), "MMM dd, yyyy - h:mm a")}</td>
                <td className="p-2 border">{format(new Date(sale.endAt), "MMM dd, yyyy - h:mm a")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (selectedStartDate || selectedEndDate) ? (
        <p>No sale found for the selected date range.</p>
      ) : (
        <p>Please select both start and end dates to view sale information.</p>
      )}
    </div>
  );
};

export default Sales;