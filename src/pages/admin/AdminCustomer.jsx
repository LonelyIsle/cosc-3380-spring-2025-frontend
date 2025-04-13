import { useState, useEffect } from "react";
import axios from "axios";
import CustomerModal from "@modal/AdminCustomerModal";

const AdminCustomer = () => {
    const [data, setData] = useState([]);
    const [nameSearch, setNameSearch] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [customerId, setCustomerId] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const getData = async () => {
        try {
            let url = `${import.meta.env.VITE_API_URL}/customer`;
            const token = localStorage.getItem("token");
            const res = await axios.get(url, {
                headers: {
                    Authorization: token,
                }
            });
            for (let d of res.data.data.rows) {
                d.name_index = [d.first_name, d.middle_name, d.last_name].join(" ");
            }
            setData(res.data.data.rows);
        } catch(e) {
            alert(e.message);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const handleViewDetail = async (id) => {
        setCustomerId(id);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCustomerId(null);
    };

    const filteredData = data.filter(d => {
        let isSubscription = 0;
        if (d.subscription) {
            isSubscription = 1;
        }
        return (nameSearch.trim() === "" ? true : d.name_index.toLowerCase().includes(nameSearch.toLowerCase()))
            && (emailSearch.trim() === "" ? true : d.email.toLowerCase().includes(emailSearch.toLowerCase()))
            && (sortKey.trim() === "" ? true : isSubscription === parseInt(sortKey));
    });

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Customer</h2>
            </div>
            <div className="flex ml-0 mr-0 mb-3">
                <div >
                    <label className="block font-semibold">Name</label>
                    <input
                        className="block p-2 border rounded bg-white text-black"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={ nameSearch } 
                        onChange={ (e) => setNameSearch(e.target.value) }
                    />
                </div>
                <div className="ml-4">
                    <label className="block font-semibold">Email</label>
                    <input
                        className="block p-2 border rounded bg-white text-black"
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={ emailSearch } 
                        onChange={ (e) => setEmailSearch(e.target.value) }
                    />
                </div>
                <div className="ml-4">
                    <label className="block font-semibold">Subscription</label>
                    <select
                        onChange={(e) => setSortKey(e.target.value)}
                        className="block border pt-2 pb-2 rounded bg-white"
                    >
                        <option value="">Subscription</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>
            </div>

            {showModal && (
                <CustomerModal
                    customerId={customerId}
                    onClose={handleModalClose}
                />
            )}

            <table className="w-full border border-black bg-gray-200">
                <thead>
                    <tr className="bg-gray-400 border-black text-black">
                        <th className="p-2 text-center border">ID</th>
                        <th className="p-2 text-center border">First Name</th>
                        <th className="p-2 text-center border">Middle Name</th>
                        <th className="p-2 text-center border">Last Name</th>
                        <th className="p-2 text-center border">Email</th>
                        <th className="p-2 text-center border">Subscription</th>
                        <th className="p-2 tex-center border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    { Array.isArray(filteredData) && filteredData.length > 0 ? (
                        filteredData.map((d) => (
                            <tr key={d.id} className="bg-gray-100">
                                <td className="p-2 text-center border">{ d.id }</td>
                                <td className="p-2 text-center border">{ d.first_name }</td>
                                <td className="p-2 text-center border">{ d.middle_name }</td>
                                <td className="p-2 text-center border">{ d.last_name }</td>
                                <td className="p-2 text-center border">{ d.email }</td>
                                <td className="p-2 text-center border">
                                    { d.subscription  
                                        ? <span className="bg-green-200 p-2 rounded mr-2 text-md font-bold">
                                            yes
                                        </span>
                                        :<span className="bg-gray-200 p-2 rounded mr-2 text-md font-bold">
                                            no
                                        </span>
                                    }
                                </td>
                                <td className="p-2 text-center border">
                                    <button
                                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleViewDetail(d.id)}
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-2 text-center text-gray-500">
                                No Data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCustomer;
