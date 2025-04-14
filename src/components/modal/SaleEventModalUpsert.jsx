import { useEffect, useState } from "react";
import { useSale } from "@context/SalesContext";
import { useCoupon } from "@context/CouponContext";

const SaleEventModalUpsert = ({ saleId = null, onClose }) => {
  const { sales, createSaleEvent, updateSaleEvent } = useSale();
  const { coupons, couponsLoaded } = useCoupon();

  const [sale, setSale] = useState({
    title: "",
    description: "",
    start_at: "",
    end_at: "",
    coupon_id: "",
  });
  const [loading, setLoading] = useState(false);

  // Instead of calling an API to get a sale event,
  // pull the sale data from the global sales array if saleId is provided.
  useEffect(() => {
    if (saleId !== null) {
      setLoading(true);
      // Find the sale event from the global sales array
      const saleData = sales.find((s) => s.id === saleId);
      if (saleData) {
        setSale({
          title: saleData.title || "",
          description: saleData.description || "",
          start_at: saleData.start_at ? saleData.start_at.slice(0, 16) : "", // yyyy-MM-ddTHH:mm
          end_at: saleData.end_at ? saleData.end_at.slice(0, 16) : "",
          coupon_id: saleData.coupon_id || "",
        });
      }
      setLoading(false);
    } else {
      // For create mode, ensure the sale state is reset.
      setSale({
        title: "",
        description: "",
        start_at: "",
        end_at: "",
        coupon_id: "",
      });
    }
  }, [saleId, sales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert the datetime-local strings to milliseconds
      const payload = {
        ...sale,
        coupon_id: sale.coupon_id ? parseInt(sale.coupon_id) : null,
        start_at: new Date(sale.start_at).getTime(),
        end_at: new Date(sale.end_at).getTime(),
      };
      if (saleId === null) {
        await createSaleEvent(payload);
      } else {
        await updateSaleEvent(saleId, payload);
      }
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to save sale event.");
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(24, 24, 37, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="bg-surface0 text-text p-6 rounded-2xl shadow-lg w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {saleId ? "Update Sale Event" : "Create Sale Event"}
        </h2>

        {loading ? (
          <p className="text-overlay1">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={sale.title}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={sale.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-surface1 text-text"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Start At</label>
                <input
                  type="datetime-local"
                  name="start_at"
                  value={sale.start_at}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-surface1 text-text"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">End At</label>
                <input
                  type="datetime-local"
                  name="end_at"
                  value={sale.end_at}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-surface1 text-text"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Coupon</label>
              {couponsLoaded ? (
                <select
                  name="coupon_id"
                  value={sale.coupon_id}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-surface1 text-text"
                  required
                >
                  <option value="">-- Select Coupon --</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.id}>
                      {coupon.code} ({coupon.type}, {coupon.value})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-overlay1">Loading coupons...</p>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-overlay1 rounded hover:bg-overlay2 transition text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green rounded hover:bg-teal text-black transition"
              >
                {saleId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SaleEventModalUpsert;
