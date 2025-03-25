import { Navbar, Footer } from "./components";
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

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Admin from "./pages/Admin";

function RedirectToHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}

function App() {
  return (
      <div className="bg-flamingo flex flex-col justify-between min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin" element={<Admin />} />
          {<Route path="*" element={<RedirectToHome />} />}
        </Routes>
        <Footer />
      </div>
  );
}

export default App;
