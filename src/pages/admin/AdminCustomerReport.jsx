import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const CustomerReport = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(1743483600000); // 04/01/2025
  const [endDate, setEndDate] = useState(1745989200000); // 04/30/2025
  const [emailSeach, setEmailSearch] = useState("");
  const [sortKey, setSortKey] = useState("");

  useEffect(() => {
    getData(startDate, endDate);
  }, [startDate, endDate]);

  const getData = async (_startDate, _endDate) => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/report/order-customer`;
      if (_startDate && _endDate) {
        url += `?start_at=${_startDate}&end_at=${_endDate}`;
      }
      const token = localStorage.getItem("token");
      const res = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      let _data = res.data.data;
      setData(_data);
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredData = data
    .filter((d) => {
      return emailSeach.trim() === ""
        ? true
        : d.customer_email.toLowerCase().includes(emailSeach.toLowerCase());
    })
    .sort((a, b) => {
      let result = -1;
      if (sortKey.trim() === "") {
        return result;
      }
      let [attr, order] = sortKey.split("-");
      if (!isNaN(a[attr])) {
        result = a[attr] - b[attr];
      } else {
        order = "asc";
      }
      return order === "desc" ? -result : result;
    });

  const chartData = {
    labels: filteredData.map((d) => d.customer_email.split("@")[0]),
    datasets: [
      {
        label: "Total Sub",
        data: filteredData.map(
          (d) => d.customer_order_subscription_total_subscription,
        ),
        backgroundColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "Total Sale (No Sub)",
        data: filteredData.map(
          (d) => d.customer_order_no_subscription_total_final,
        ),
        backgroundColor: "rgba(255, 159, 64, 1)",
      },
      {
        label: "Total Sale (Sub)",
        data: filteredData.map(
          (d) => d.customer_order_subscription_total_final,
        ),
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
      {
        label: "Total Sale",
        data: filteredData.map((d) => d.customer_order_total_final),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
    },
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Report</h2>
      </div>
      <Bar data={chartData} options={chartOptions} />
      <div className="flex ml-0 mr-0 mb-1">
        <div className="">
          <label className="block font-semibold">Start Date</label>
          <input
            className="block p-2 border rounded bg-white text-black"
            type="date"
            name="start-date"
            placeholder="Start Date"
            value={new Date(startDate).toISOString().substring(0, 10)}
            onChange={(e) => setStartDate(e.target.valueAsNumber)}
          />
        </div>
        <div className="ml-4">
          <label className="block font-semibold">End Date</label>
          <input
            className="block p-2 border rounded bg-white text-black"
            type="date"
            name="end-date"
            placeholder="End Date"
            value={new Date(endDate).toISOString().substring(0, 10)}
            onChange={(e) => setEndDate(e.target.valueAsNumber)}
          />
        </div>
        <div className="ml-auto">
          <label className="block font-semibold">Sort By</label>
          <select
            onChange={(e) => setSortKey(e.target.value)}
            className="block border pt-2 pb-2 rounded bg-white"
          >
            <option value="">Sort By</option>
            <option value="customer_order_no_subscription_count-asc">
              Total Order (No Sub) Asc
            </option>
            <option value="customer_order_no_subscription_count-desc">
              Total Order (No Sub) Desc
            </option>
            <option value="customer_order_subscription_count-asc">
              Total Order (Sub) Asc
            </option>
            <option value="customer_order_subscription_count-desc">
              Total Order (Sub) Desc
            </option>
            <option value="customer_order_count-asc">Total Order Asc</option>
            <option value="customer_order_count-desc">Total Order Desc</option>
            <option value="customer_order_subscription_total_subscription-asc">
              Total Sub Asc
            </option>
            <option value="customer_order_subscription_total_subscription-desc">
              Total Sub Desc
            </option>
            <option value="customer_order_no_subscription_total_final-asc">
              Total Sale (No Sub) Asc
            </option>
            <option value="customer_order_no_subscription_total_final-desc">
              Total Sale (No Sub) Desc
            </option>
            <option value="customer_order_subscription_total_final-asc">
              Total Sale (Sub) Asc
            </option>
            <option value="customer_order_subscription_total_final-desc">
              Total Sale (Sub) Desc
            </option>
            <option value="customer_order_total_final-asc">
              Total Sale Asc
            </option>
            <option value="customer_order_total_final-desc">
              Total Sale Desc
            </option>
          </select>
        </div>
      </div>
      <div className="flex ml-0 mr-0 mb-3">
        <div>
          <label className="block font-semibold">Email</label>
          <input
            className="block p-2 border rounded bg-white text-black"
            type="text"
            name="email"
            placeholder="Email"
            value={emailSeach}
            onChange={(e) => setEmailSearch(e.target.value)}
          />
        </div>
      </div>
      <table className="w-full border border-black bg-gray-200">
        <thead>
          <tr className="bg-gray-400 border-black text-black">
            <th className="p-2 text-center border">ID</th>
            <th className="p-2 text-center border">Email</th>
            <th className="p-2 text-center border">Total Order (No Sub)</th>
            <th className="p-2 text-center border">Total Order (Sub)</th>
            <th className="p-2 text-center border">Total Order</th>
            <th className="p-2 text-center border">Total Sub</th>
            <th className="p-2 text-center border">Total Sale (No Sub)</th>
            <th className="p-2 text-center border">Total Sale (Sub)</th>
            <th className="p-2 text-center border">Total Sale</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredData) && filteredData.length > 0 ? (
            filteredData.map((d) => (
              <tr key={d.customer_id} className="bg-gray-100">
                <td className="p-2 text-center border">{d.customer_id}</td>
                <td className="p-2 text-center border">{d.customer_email}</td>
                <td className="p-2 text-center border">
                  {d.customer_order_no_subscription_count}
                </td>
                <td className="p-2 text-center border">
                  {d.customer_order_subscription_count}
                </td>
                <td className="p-2 text-center border">
                  {d.customer_order_count}
                </td>
                <td className="p-2 text-center border">{`$${d.customer_order_subscription_total_subscription.toFixed(2)}`}</td>
                <td className="p-2 text-center border">{`$${d.customer_order_no_subscription_total_final.toFixed(2)}`}</td>
                <td className="p-2 text-center border">{`$${d.customer_order_subscription_total_final.toFixed(2)}`}</td>
                <td className="p-2 text-center border">{`$${d.customer_order_total_final.toFixed(2)}`}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="p-2 text-center text-gray-500">
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerReport;
