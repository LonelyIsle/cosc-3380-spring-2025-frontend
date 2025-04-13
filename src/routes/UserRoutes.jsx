import { Route } from "react-router-dom";
import LandingPage from "@pages/LandingPage";
import Login from "@auth/Login";
import Fpassword from "@auth/ForgotPassword";
import Profile from "@user/Profile";
import Register from "@auth/Register";
import Product from "@shop/Product";
import Shop from "@shop/Shop";
import Cart from "@shop/Cart";
import Checkout from "@shop/Checkout";
import Subscription from "@shop/Subscription";

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
