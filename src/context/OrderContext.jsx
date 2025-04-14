import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);
const getToken = () => localStorage.getItem("token");
const URL_PATH = `${import.meta.env.VITE_API_URL}`;

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  // Prepare authorization header for endpoints that require authentication
  const token = getToken();
  const authHeader = { headers: { Authorization: token } };

  // Fetch all orders (GET order)
  const fetchOrders = async () => {
    setOrdersLoaded(false);
    try {
      const res = await axios.get(`${URL_PATH}/order`, authHeader);
      // Map the returned rows; adjust mapping if you need to transform the order data.
      const mappedOrders = res.data.data.rows.map((order) => ({
        id: order.id,
        customer_id: order.customer_id,
        customer_first_name: order.customer_first_name,
        customer_middle_name: order.customer_middle_name,
        customer_last_name: order.customer_last_name,
        customer_email: order.customer_email,
        subscription_id: order.subscription_id,
        subscription_discount_percentage:
          order.subscription_discount_percentage,
        coupon_id: order.coupon_id,
        coupon_value: order.coupon_value,
        coupon_type: order.coupon_type,
        shipping_fee: order.shipping_fee,
        sale_tax: order.sale_tax,
        total_origin: order.total_origin,
        total_subscription: order.total_subscription,
        total_coupon: order.total_coupon,
        total_sale_tax: order.total_sale_tax,
        total_final: order.total_final,
        tracking: order.tracking,
        status: order.status,
        shipping_address_1: order.shipping_address_1,
        shipping_address_2: order.shipping_address_2,
        shipping_address_city: order.shipping_address_city,
        shipping_address_state: order.shipping_address_state,
        shipping_address_zip: order.shipping_address_zip,
        billing_address_1: order.billing_address_1,
        billing_address_2: order.billing_address_2,
        billing_address_city: order.billing_address_city,
        billing_address_state: order.billing_address_state,
        billing_address_zip: order.billing_address_zip,
        created_at: order.created_at,
        updated_at: order.updated_at,
        deleted_at: order.deleted_at,
        is_deleted: order.is_deleted,
        items: order.items, // Assuming 'items' is an array of order items
        customer: order.customer,
        subscription: order.subscription,
        coupon: order.coupon,
      }));
      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setOrdersLoaded(true);
    }
  };

  // Fetch a single order by id (GET order/:id)
  const fetchOrderById = async (id) => {
    try {
      const res = await axios.get(`${URL_PATH}/order/${id}`, authHeader);
      return res.data.data;
    } catch (err) {
      console.error(`Failed to fetch order with id ${id}:`, err);
      throw err;
    }
  };

  // Create a new order (POST order)
  const createOrder = async (data) => {
    try {
      const res = await axios.post(`${URL_PATH}/order`, data, authHeader);
      // Optionally refresh the orders list after creation
      fetchOrders();
      return res.data.data;
    } catch (err) {
      console.error("Failed to create order:", err);
      throw err;
    }
  };

  // Update order (PATCH order/:id)
  // For example, updating the tracking number.
  const updateOrder = async (id, data) => {
    try {
      const res = await axios.patch(
        `${URL_PATH}/order/${id}`,
        data,
        authHeader,
      );
      fetchOrders(); // Refresh the orders list after updating
      return res.data.data;
    } catch (err) {
      console.error(`Failed to update order with id ${id}:`, err);
      throw err;
    }
  };

  // Cancel an order (PATCH order/:id/cancel)
  // Pass the order id; no additional payload is required.
  const cancelOrder = async (id) => {
    try {
      const res = await axios.patch(
        `${URL_PATH}/order/${id}/cancel`,
        {},
        authHeader,
      );
      fetchOrders(); // Refresh the orders list after cancellation
      return res.data.data;
    } catch (err) {
      console.error(`Failed to cancel order with id ${id}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        ordersLoaded,
        fetchOrders,
        fetchOrderById,
        createOrder,
        updateOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;
