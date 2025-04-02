function OrderHistory() {
  return (
    <div className="flex flex-col items-center">
      <h1>Past Purchases</h1>
      <table className="table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">First Name</th>
            <th className="border border-gray-400 px-4 py-2">Last Name</th>
            <th className="border border-gray-400 px-4 py-2">Item</th>
            <th className="border border-gray-400 px-4 py-2">Purchase Price</th>
            <th className="border border-gray-400 px-4 py-2">
              Shipping Address
            </th>
            <th className="border border-gray-400 px-4 py-2">Order Number</th>
          </tr>
        </thead>
        <tbody>
          {/* Replace this with your actual order data, mapped to table rows */}
          <tr>
            <td className="border border-gray-400 px-4 py-2">John</td>
            <td className="border border-gray-400 px-4 py-2">Doe</td>
            <td className="border border-gray-400 px-4 py-2">Widget</td>
            <td className="border border-gray-400 px-4 py-2">$19.99</td>
            <td className="border border-gray-400 px-4 py-2">123 Main St</td>
            <td className="border border-gray-400 px-4 py-2">ORD-12345</td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-4 py-2">Jane</td>
            <td className="border border-gray-400 px-4 py-2">Smith</td>
            <td className="border border-gray-400 px-4 py-2">Gadget</td>
            <td className="border border-gray-400 px-4 py-2">$29.99</td>
            <td className="border border-gray-400 px-4 py-2">456 Oak Ave</td>
            <td className="border border-gray-400 px-4 py-2">ORD-67890</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
