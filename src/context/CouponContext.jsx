import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CouponContext = createContext();
export const useCoupon = () => useContext(CouponContext);
const getToken = () => localStorage.getItem("token");
const URL_PATH = `${import.meta.env.VITE_API_URL}`;

export function CouponProvider({ children }) {
  // State to hold coupon list, load state, and the active coupon (fetched by code)
  const [coupons, setCoupons] = useState([]);
  const [couponsLoaded, setCouponsLoaded] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Fetch an active coupon by its code (GET coupon/:code/active)
  const fetchActiveCoupon = async (code) => {
    try {
      const res = await axios.get(`${URL_PATH}/coupon/${code}/active`);
      setActiveCoupon(res.data.data);
    } catch (err) {
      console.error("Failed to fetch active coupon for code:", code, err);
      setActiveCoupon(null);
    }
  };

  // Fetch all coupons (GET coupon)
  const fetchCoupons = async () => {
    setCouponsLoaded(false);
    try {
      const res = await axios.get(`${URL_PATH}/coupon`);
      const mappedCoupons = res.data.data.rows.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        value: coupon.value,
        start_at: coupon.start_at,
        end_at: coupon.end_at,
        type: coupon.type,
        description: coupon.description,
        created_at: coupon.created_at,
        updated_at: coupon.updated_at,
        deleted_at: coupon.deleted_at,
        is_deleted: coupon.is_deleted,
      }));
      setCoupons(mappedCoupons);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setCouponsLoaded(true);
    }
  };

  // Fetch a coupon by its id (GET coupon/:id)
  const fetchCouponById = async (id) => {
    try {
      const res = await axios.get(`${URL_PATH}/coupon/${id}`);
      return res.data.data;
    } catch (err) {
      console.error(`Failed to fetch coupon with id ${id}:`, err);
      throw err;
    }
  };

  // Prepare authorization header using the token
  const token = getToken();
  const authHeader = { headers: { Authorization: token } };

  // Create a new coupon (POST coupon)
  const createCoupon = async (data) => {
    try {
      const res = await axios.post(`${URL_PATH}/coupon`, data, authHeader);
      // Refresh coupons list after creation
      fetchCoupons();
      return res.data.data;
    } catch (err) {
      console.error("Failed to create coupon:", err);
      throw err;
    }
  };

  // Update an existing coupon (PATCH coupon/:id)
  const updateCoupon = async (id, data) => {
    try {
      const res = await axios.patch(
        `${URL_PATH}/coupon/${id}`,
        data,
        authHeader,
      );
      // Refresh coupons list after update
      fetchCoupons();
      return res.data.data;
    } catch (err) {
      console.error(`Failed to update coupon with id ${id}:`, err);
      throw err;
    }
  };

  // Delete a coupon (DEL coupon/:id)
  const deleteCoupon = async (id) => {
    try {
      await axios.delete(`${URL_PATH}/coupon/${id}`, authHeader);
      // Refresh coupons list after deletion
      fetchCoupons();
    } catch (err) {
      console.error(`Failed to delete coupon with id ${id}:`, err);
      throw err;
    }
  };

  // Fetch coupon list on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <CouponContext.Provider
      value={{
        coupons,
        couponsLoaded,
        activeCoupon,
        fetchActiveCoupon,
        fetchCoupons,
        fetchCouponById,
        createCoupon,
        updateCoupon,
        deleteCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export default CouponContext;
