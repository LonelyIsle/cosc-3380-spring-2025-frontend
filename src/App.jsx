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

function App() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Navbar />
      <div className="grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<Product />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
