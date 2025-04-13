import { useState, useEffect } from "react";
import axios from "axios";

const Notification = () => {
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            let url = `${import.meta.env.VITE_API_URL}/notification?sort_by=created_at-desc`;
            const token = localStorage.getItem("token");
            const res = await axios.get(url, {
                headers: {
                    Authorization: token,
                }
            });
            setData(res.data.data.rows);
        } catch(e) {
            alert(e.message);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const handleReadNotification = async (id) => {
        try {
            let url = `${import.meta.env.VITE_API_URL}/notification/${id}`;
            const token = localStorage.getItem("token");
            const res = await axios.patch(url, 
                {
                    status: 1
                }, {
                headers: {
                    Authorization: token,
                }
            });
            getData();
        } catch(e) {
            alert(e.message);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Notification</h2>
            </div>
            <table className="w-full border border-black bg-gray-200">
                <thead>
                    <tr className="bg-gray-400 border-black text-black">
                        <th className="p-2 text-center border">ID</th>
                        <th className="p-2 text-center border">Content</th>
                        <th className="p-2 text-center border">Status</th>
                        <th className="p-2 text-center border">Created At</th>
                        <th className="p-2 tex-center border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    { Array.isArray(data) && data.length > 0 ? (
                        data.map((d) => (
                            <tr key={d.id} className="bg-gray-100">
                                <td className="p-2 text-center border">{ d.id }</td>
                                <td className="p-2 text-center border">{ d.description }</td>
                                <td className="p-2 text-center border">
                                    { d.status === 0  
                                        ? <span className="bg-red-200 p-2 rounded mr-2 text-md font-bold">
                                            unread
                                        </span>
                                        :<span className="bg-gray-200 p-2 rounded mr-2 text-md font-bold">
                                            read
                                        </span>
                                    }
                                </td>
                                <td className="p-2 text-center border">{ new Date(d.created_at).toLocaleDateString("en-US") }</td>
                                <td className="p-2 text-center border">
                                    <button
                                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleReadNotification(d.id)}
                                    >
                                        Mark As Read
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-2 text-center text-gray-500">
                                No Data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Notification;
