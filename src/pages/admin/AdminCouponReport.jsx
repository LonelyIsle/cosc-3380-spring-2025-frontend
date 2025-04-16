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

const CouponReport = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(1743483600000); // 04/01/2025
  const [endDate, setEndDate] = useState(1745989200000); // 04/30/2025
  const [codeSearch, setCodeSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [sortKey, setSortKey] = useState("");

  useEffect(() => {
    getData(startDate, endDate);
  }, [startDate, endDate]);

  const getData = async (_startDate, _endDate) => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/report/order-coupon`;
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
      return (
        (codeSearch.trim() === ""
          ? true
          : d.coupon_code.toLowerCase().includes(codeSearch.toLowerCase())) &&
        (typeSearch.trim() === ""
          ? true
          : d.coupon_type === parseInt(typeSearch))
      );
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
    labels: filteredData.map((d) => d.coupon_code),
    datasets: [
      {
        label: "Coupon",
        data: filteredData.map((d) => d.coupon_order_total_coupon),
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
      {
        label: "Total Final",
        data: filteredData.map((d) => d.coupon_order_total_final),
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
        <h2 className="text-2xl font-bold">Coupon Report</h2>
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
            <option value="coupon_value-asc">Value Asc</option>
            <option value="coupon_value-desc">Value Desc</option>
            <option value="coupon_order_count-asc">Order Count Asc</option>
            <option value="coupon_order_count-desc">Order Count Desc</option>
            <option value="coupon_order_total_origin-asc">Subtotal Asc</option>
            <option value="coupon_order_total_origin-desc">Subtotal Desc</option>
            <option value="coupon_order_total_subscription-asc">Subscription Asc</option>
            <option value="coupon_order_total_subscription-desc">Subscription Desc</option>
            <option value="coupon_order_total_coupon-asc">Coupon Asc</option>
            <option value="coupon_order_total_coupon-desc">Coupon Desc</option>
            <option value="coupon_order_total_shipping-asc">Shipping Asc</option>
            <option value="coupon_order_total_shipping-desc">Shipping Desc</option>
            <option value="coupon_order_total_sale_tax-asc">Sale Tax Asc</option>
            <option value="coupon_order_total_sale_tax-desc">Sale Tax Desc</option>
            <option value="coupon_order_total_final-asc">Total Final Asc</option>
            <option value="coupon_order_total_final-desc">Total Final Desc</option>
          </select>
        </div>
      </div>
      <div className="flex ml-0 mr-0 mb-3">
        <div>
          <label className="block font-semibold">Code</label>
          <input
            className="block p-2 border rounded bg-white text-black"
            type="text"
            name="code"
            placeholder="Code"
            value={codeSearch}
            onChange={(e) => setCodeSearch(e.target.value)}
          />
        </div>
        <div className="ml-4">
          <label className="block font-semibold">Type</label>
          <select
            onChange={(e) => setTypeSearch(e.target.value)}
            className="block border pt-2 pb-2 rounded bg-white"
          >
            <option value="">Type</option>
            <option value="0">%</option>
            <option value="1">$</option>
          </select>
        </div>
      </div>
      <table className="w-full border border-black bg-gray-200">
        <thead>
          <tr className="bg-gray-400 border-black text-black">
            <th className="p-2 text-center border">ID</th>
            <th className="p-2 text-center border">Code</th>
            <th className="p-2 text-center border">Value</th>
            <th className="p-2 text-center border">Type</th>
            <th className="p-2 text-center border">Order Count</th>
            <th className="p-2 text-center border">Subtotal</th>
            <th className="p-2 text-center border">Subscription</th>
            <th className="p-2 text-center border">Coupon</th>
            <th className="p-2 text-center border">Shipping</th>
            <th className="p-2 text-center border">Sale Tax</th>
            <th className="p-2 text-center border">Total Final</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredData) && filteredData.length > 0 ? (
            filteredData.map((d) => (
              <tr key={d.coupon_id} className="bg-gray-100">
                <td className="p-2 text-center border">{d.coupon_id}</td>
                <td className="p-2 text-center border">{d.coupon_code}</td>
                <td className="p-2 text-center border">
                  {d.coupon_type === 0
                    ? `${d.coupon_value * 100}%`
                    : `$${d.coupon_value.toFixed(2)}`}
                </td>
                <td className="p-2 text-center border">
                  {d.coupon_type === 0 ? "%" : "$"}
                </td>
                <td className="p-2 text-center border">
                  {d.coupon_order_count}
                </td>
                <td className="p-2 text-center border">{`$${d.coupon_order_total_origin.toFixed(2)}`}</td>
                <td className="p-2 text-center border">{`-$${d.coupon_order_total_subscription.toFixed(2)}`}</td>
                <td className="p-2 text-center border">{`-$${d.coupon_order_total_coupon.toFixed(2)}`}</td>
                <td className="p-2 text-center border">{`$${d.coupon_order_total_shipping.toFixed(2)}`}</td>
                <td className="p-2 text-center border">{`$${d.coupon_order_total_sale_tax.toFixed(2)}`}</td>
                <td className="p-2 text-center border">{`$${d.coupon_order_total_final.toFixed(2)}`}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="p-2 text-center text-gray-500">
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CouponReport;
