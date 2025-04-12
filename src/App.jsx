import { Navbar, Footer, SalesBanner } from "./components";
import { Route, Routes } from "react-router-dom";
import {
  Cart,
  Checkout,
  LandingPage,
  Login,
  Product,
  Profile,
  Register,
  Shop,
} from "./pages";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Admin from "./pages/Admin";
import { Adminlogin } from "./pages";
import Fpassword from "./pages/ForgotPassword";
import Restock from "./pages/Restock";
import CategoryChanges from "./pages/CategoryChanges";

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fpassword" element={<Fpassword />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<Adminlogin />} />
        <Route path="/edit-category/:id" element={<CategoryChanges />} />
        <Route path="/restock/:id" element={<Restock />} />
        {<Route path="*" element={<RedirectToHome />} />}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
