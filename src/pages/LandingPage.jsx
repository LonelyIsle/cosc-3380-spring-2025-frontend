import { Link } from "react-router-dom";
import Logo from "../assets/bag-full-logo.svg";
import Seperator from "../assets/header-seperator.svg";

function LandingPage() {
  return (
    <>
      <div className="bg-sky flex flex-col justify-end items-center">
        <img
          src={Logo}
          alt="MofuMofuMart Logo"
          className="relative top-[12vh]"
        />
        <Link
          to="/shop"
          className="header-box relative top-[18vh] px-10 bg-mantle text-text"
        >
          Shop
        </Link>
        <img src={Seperator} alt="Page Seperator" className="" />
      </div>
    </>
  );
}

export default LandingPage;
