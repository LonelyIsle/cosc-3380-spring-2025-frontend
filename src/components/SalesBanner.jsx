import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SalesBanner = () => {
  const location = useLocation();
  const isVisible = location.pathname === "/" || location.pathname === "/shop";

  if (!isVisible) return null;

  const [saleEvent, setSaleEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/sale-event/one/active`)
      .then((res) => {
        if (res.data.message === "success" && res.data.data) {
          setSaleEvent(res.data.data);
        }
      })
      .catch((err) => {
        console.error(
          "Failed to Load Sale Event:",
          err.response?.data || err.message
        );
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // If we're still loading or there's no active sale event, don't render the banner
  if (loading || !saleEvent) return null;

  // Format the sale event information for display
  const announcementText = (
    <>
      <span>🔥 {saleEvent.title}</span>
      <span className="separator"></span>
      <span>Use code: {saleEvent.coupon?.code}</span>
      <span className="separator"></span>
      <span>
        Discount runs until {new Date(saleEvent.end_at).toLocaleDateString()}!
      </span>
    </>
  );

  return (
    <div className="w-full bg-pink text-mantle py-2 overflow-hidden">
      <div className="scrolling-text-container">
        <div className="scrolling-text">
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <span key={`segment-${index}`} className="announcement-segment">
                {announcementText}
              </span>
            ))}
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <span key={`duplicate-${index}`} className="announcement-segment">
                {announcementText}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SalesBanner;
