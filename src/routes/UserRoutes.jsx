import {
  Route
} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Fpassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Product from "../pages/Product";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Subscription from "../pages/Subscription";

const UserRoutes = () => (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/fpassword" element={<Fpassword />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/register" element={<Register />} />
    <Route path="/product/:id" element={<Product />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/subscription" element={<Subscription />} />
  </>
);

export default UserRoutes;
