import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/navbar-logo.svg";

const svgs = import.meta.glob("../assets/cart-assets/*.svg", { eager: true });
const cartSvgs = Object.entries(svgs).reduce((acc, [path, module]) => {
  const key = path.split("/").pop().replace(".svg", "");
  acc[key] = module.default;
  return acc;
}, {});

function Navbar() {
  const [opacity, setOpacity] = useState(100);
  const [cartAmount, setCartAmount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pxDelimeter = 100;

      setOpacity((prevOpacity) => {
        if (scrollY > pxDelimeter && prevOpacity !== 80) {
          console.log(80);
          return 80;
        } else if (scrollY <= pxDelimeter && prevOpacity !== pxDelimeter) {
          console.log(pxDelimeter);
          return pxDelimeter;
        }
        return prevOpacity; // Ensure no unnecessary re-renders
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // No need to include `opacity` in the dependency array

  return (
    <nav
      className="h-20 bg-mantle flex justify-between items-center px-28 sticky top-0 z-10 transition-opacity duration-300"
      style={{ opacity: `${opacity}%` }}
    >
      <Link to="/" className="text-3xl text-text">
        <img src={logo} alt="Navbar Logo" className="header-box h-20" />
      </Link>
      <ul className="flex gap-4 justify-center items-center">
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
            to="/profile"
            className="header-box text-mantle bg-gradient-to-r from-green to-teal"
          >
            Profile Page
          </Link>
        </li>
        <li>
          <Link to="/cart">
            <img
              src={cartSvgs[`cart-${cartAmount}`]}
              alt="Cart"
              className="header-box h-20"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
