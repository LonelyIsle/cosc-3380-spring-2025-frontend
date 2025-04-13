import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "@ui/Navbar";
import Footer from "@ui/Footer";
import SalesBanner from "@ui/SalesBanner";
import UserRoutes from "@routes/UserRoutes";
import AdminRoutes from "@routes/AdminRoutes";

function RedirectToHome() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);
  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <div className="bg-flamingo flex flex-col justify-between min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <SalesBanner />
      <Routes>
        <Route path="*" element={<RedirectToHome />} />
        {UserRoutes()}
        {AdminRoutes()}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
