import { Link } from "react-router-dom";
import logo from "../assets/navbar-logo.svg";

function Navbar() {
  return (
    <nav className="h-20 bg-mantle/90 flex justify-between items-center px-30 sticky top-0 z-10">
      <Link to="/" className="text-3xl text-text">
        <img src={logo} alt="Navbar Logo" className="h-20" />
      </Link>
      <ul className="flex gap-4">
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
      </ul>
    </nav>
  );
}

export default Navbar;
