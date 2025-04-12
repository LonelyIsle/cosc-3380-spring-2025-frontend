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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ProductReport = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(1743483600000); 
    const [endDate, setEndDate] = useState(1745989200000); 
    const [nameSearchTerm, setNameSearchTerm] = useState("");
    const [skuSearchTerm, setSKUSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [categorySearchTerm, setCategorySearchTerm] = useState("");

    useEffect(() => {
        getData(startDate, endDate);
    }, [startDate, endDate]);

    const getData = async (_startDate, _endDate) => {
        try {
            let url = `${import.meta.env.VITE_API_URL}/report/order-product`;
            if (_startDate && _endDate) {
                url += `?start_at=${_startDate}&end_at=${_endDate}`;
            }
            const token = localStorage.getItem("token");
            const res = await axios.get(url, {
                headers: {
                    Authorization: token,
                }
            });
            for (let d of res.data.data) {
                d.product_category_index = d.product_category.map(c => c.name).join(" ");
            }
            setData(res.data.data);
        } catch(e) {
            alert(e.message);
        }
    }

    const filteredData = data.filter(d => {
        return d.product_name.toLowerCase().includes(nameSearchTerm.toLowerCase())
            && d.product_sku.toLowerCase().includes(skuSearchTerm.toLowerCase())
            && d.product_category_index.toLowerCase().includes(categorySearchTerm.toLowerCase());
    }).sort((a, b) => {
        let result = -1;
        if (sortKey.trim() === "") {
            return result;
        }
        let [attr, order] = sortKey.split("-");
        switch(attr) {
            case "product_price":
                result = a.product_price - b.product_price;
                break;
            case "product_quantity":
                result = a.product_quantity - b.product_quantity;
                break;
            case "product_order_count":
                result = a.product_order_count - b.product_order_count;
                break;
            case "product_total_quantity":
                result = a.product_total_quantity - b.product_total_quantity;
                break;
            case "product_total_price":
                result = a.product_total_price - b.product_total_price;
                break;
            default:
                order = "asc";
                break;
        }
        return order === "desc" ? -result : result;
    });;

    const chartData = {
        labels: filteredData.map(d => d.product_name),
        datasets: [{
            label: "Total Quantity",
            data: filteredData.map(d => d.product_total_quantity),
            backgroundColor: 'rgba(53, 162, 235, 1)'
        }, {
            label: "Total Sale",
            data: filteredData.map(d => d.product_total_price),
            backgroundColor: 'rgba(255, 99, 132, 1)'
        }]
    }

    const chartOptions = {
        plugins: {
          title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked',
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true
          }
        },
      };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Product Report</h2>
            </div>
            <Bar
                data={ chartData }
                options={ chartOptions }
            />
            <div className="flex ml-0 mr-0 mb-3">
                <div className="">
                    <label className="block font-semibold">Start Date</label>
                    <input
                        className="block p-2 border rounded bg-white text-black"
                        type="date"
                        name="start-date"
                        placeholder="Start Date"
                        value={ new Date(startDate).toISOString().substring(0, 10) } 
                        onChange={ (e) => setStartDate(e.target.valueAsNumber) }
                    />
                </div>
                <div className="ml-4">
                    <label className="block font-semibold">End Date</label>
                    <input
                        className="block p-2 border rounded bg-white text-black"
                        type="date"
                        name="end-date"
                        placeholder="End Date"
                        value={ new Date(endDate).toISOString().substring(0, 10) }
                        onChange={ (e) => setEndDate(e.target.valueAsNumber) }
                    />
                </div>
                <div className="ml-auto">
                    <label className="block font-semibold">Sort By</label>
                    <select
                        onChange={(e) => setSortKey(e.target.value)}
                        className="block border pt-2 pb-2 rounded bg-white"
                    >
                        <option value="">Sort By</option>
                        <option value="product_price-asc">Price Asc</option>
                        <option value="product_price-desc">Price Desc</option>
                        <option value="product_quantity-asc">Quantity Asc</option>
                        <option value="product_quantity-desc">Quantity Desc</option>
                        <option value="product_order_count-asc">Order Count Asc</option>
                        <option value="product_order_count-desc">Order Count Desc</option>
                        <option value="product_total_quantity-asc">Total Quantity Asc</option>
                        <option value="product_total_quantity-desc">Total Quantity Desc</option>
                        <option value="product_total_price-asc">Total Sale Asc</option>
                        <option value="product_total_price-desc">Total Sale Desc</option>
                    </select>
                </div>
            </div>
            <div className="flex ml-0 mr-0 mb-3">
                <div >
                    <label className="block font-semibold">Name</label>
                    <input
                        className="block p-2 border rounded bg-white text-black"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={ nameSearchTerm } 
                        onChange={ (e) => setNameSearchTerm(e.target.value) }
                    />
                </div>
                <div className="ml-4">
                    <label className="block font-semibold">SKU</label>
                    <input
                        className="block p-2 border rounded bg-white text-black"
                        type="text"
                        name="sku"
                        placeholder="SKU"
                        value={ skuSearchTerm } 
                        onChange={ (e) => setSKUSearchTerm(e.target.value) }
                    />
                </div>
                <div className="ml-4">
                    <label className="block font-semibold">Category</label>
                    <input
                        className="block p-2 border rounded bg-white text-black"
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={ categorySearchTerm } 
                        onChange={ (e) => setCategorySearchTerm(e.target.value) }
                    />
                </div>
            </div>
            <table className="w-full border border-black bg-gray-200">
                <thead>
                    <tr className="bg-gray-400 border-black text-black">
                        <th className="p-2 text-center border">ID</th>
                        <th className="p-2 text-center border">SKU</th>
                        <th className="p-2 text-center border">Name</th>
                        <th className="p-2 text-center border">Price</th>
                        <th className="p-2 text-center border">Quantity</th>
                        <th className="p-2 text-center border">Threshold</th>
                        <th className="p-2 text-center border">Order Count</th>
                        <th className="p-2 text-center border">Total Quantity</th>
                        <th className="p-2 text-center border">Total Sale</th>
                        <th className="p-2 text-center border">Category</th>
                    </tr>
                </thead>
                <tbody>
                    { Array.isArray(filteredData) && filteredData.length > 0 ? (
                        filteredData.map((d) => (
                            <tr key={d.product_id} className="bg-gray-100">
                                <td className="p-2 text-center border">{ d.product_id }</td>
                                <td className="p-2 text-center border">{ d.product_sku }</td>
                                <td className="p-2 text-center border">{ d.product_name }</td>
                                <td className="p-2 text-center border">{ d.product_price.toFixed(2) }</td>
                                <td className="p-2 text-center border">{ d.product_quantity }</td>
                                <td className="p-2 text-center border">{ d.product_threshold }</td>
                                <td className="p-2 text-center border">{ d.product_order_count }</td>
                                <td className="p-2 text-center border">{ d.product_total_quantity }</td>
                                <td className="p-2 text-center border">{ d.product_total_price.toFixed(2) }</td>
                                <td className="p-2 text-center border">{ d.product_category.map((c) => c.name).join(", ") }</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-2 text-center text-gray-500">
                                No Data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductReport;
