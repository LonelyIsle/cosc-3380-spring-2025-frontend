import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useEffect, useState } from "react";
import { useCart } from "@context/CartContext";
import logo from "@assets/navbar-logo.svg";

const svgs = import.meta.glob("../../assets/cart-assets/*.svg", {
  eager: true,
});
const cartSvgs = Object.entries(svgs).reduce((acc, [path, module]) => {
  const key = path.split("/").pop().replace(".svg", "");
  acc[key] = module.default;
  return acc;
}, {});

function Navbar({ isLoggedIn, handleLogout }) {
  const { getCartQuantity } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate

  const cartQuantity = getCartQuantity();

  const cartIcon =
    cartQuantity > 10
      ? cartSvgs["cart-overflow"]
      : cartSvgs[`cart-${cartQuantity}`];

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("This is navbar User", user);
  const userRole = user?.role;
  console.log("This is navbar User", userRole);

  const handleLogoutAndNavigate = () => {
    handleLogout(); // Call the logout function
    navigate("/login"); // Navigate to the login page
  };

  return (
    <nav className="h-20 bg-mantle flex justify-between items-center px-28 sticky top-0 z-10 transition-all duration-300">
      <Link to="/" className="text-3xl text-text">
        <img src={logo} alt="Navbar Logo" className="header-box h-20" />
      </Link>
      <ul className="flex gap-4 justify-center items-center">
        {isLoggedIn ? (
          userRole === 1 || userRole === 0 ? (
            // 🛠 Admin view
            <>
              <li>
                <button
                  onClick={handleLogoutAndNavigate}
                  className="header-box text-mantle bg-gradient-to-r from-maroon to-peach"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            // 🛒 Customer view
            <>
              <li>
                <Link
                  to="/shop"
                  className="header-box text-mantle bg-gradient-to-r from-blue to-sapphire"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="header-box text-mantle bg-gradient-to-r from-blue to-sapphire"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogoutAndNavigate}
                  className="header-box text-mantle bg-gradient-to-r from-maroon to-peach"
                >
                  Logout
                </button>
              </li>
              <li>
                <Link to="/cart">
                  <img src={cartIcon} alt="Cart" className="header-box h-20" />
                </Link>
              </li>
            </>
          )
        ) : (
          // 👥 Not logged in
          <>
            <li>
              <Link
                to="/login"
                className="header-box text-mantle bg-gradient-to-r from-maroon to-peach"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="header-box text-mantle bg-gradient-to-r from-green to-teal"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/admin/login"
                className="header-box text-mantle bg-gradient-to-r from-green to-teal"
              >
                Admin
              </Link>
            </li>
            <li>
              <Link to="/cart">
                <img src={cartIcon} alt="Cart" className="header-box h-20" />
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
