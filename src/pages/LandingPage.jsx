import { Link } from "react-router-dom";
import Logo from "../assets/bag-full-logo.svg";
import Seperator from "../assets/header-seperator.svg";

function LandingPage() {
  return (
    <>
      <div className="bg-sky flex flex-col justify-end items-center h-[85vh]">
        <img
          src={Logo}
          alt="MofuMofuMart Logo"
          className="h-[50vh] absolute top-[12vh]"
        />
        <div className="header-box absolute top-[68vh] px-10 bg-mantle text-text">
          <Link to="/shop" className="">
            Shop
          </Link>
        </div>
        <img src={Seperator} alt="Page Seperator" className="" />
      </div>
      <div className="grow flex justify-center items-center h-100">sex</div>
    </>
  );
}

export default LandingPage;
