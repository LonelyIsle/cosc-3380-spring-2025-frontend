import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="h-20 bg-mantle flex justify-between items-center px-10">
      <Link to="/" className="text-3xl text-text">
        MofuMart
      </Link>
      <ul className="flex gap-4">
        <li>
          <Link to="/login" className="header-box text-mantle bg-gradient-to-r from-maroon to-peach">
            Sign In
          </Link>
        </li>
        <li>
          <Link to="/register" className="header-box text-mantle bg-gradient-to-r from-green to-teal">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
