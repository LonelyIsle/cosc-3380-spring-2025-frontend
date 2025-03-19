import { Link } from "react-router-dom";
import Logo from "../assets/bag-full-logo.svg";
import Seperator from "../assets/header-seperator.svg";
import { ProductGrid } from "../components";

const products = [
  {
    id: 1,
    name: "product 1",
    price: 19.99,
    image: "",
    description: "this is a description for product 1.",
    category: ["animals", "anime"],
    size: 1.5,
    color: "red",
  },
  {
    id: 2,
    name: "product 2",
    price: 29.99,
    image: "",
    description: "this is a description for product 2.",
    category: ["movies & tv shows"],
    size: 2.5,
    color: "blue",
  },
  {
    id: 3,
    name: "product 3",
    price: 39.99,
    image: "",
    description: "this is a description for product 3.",
    category: ["anime"],
    size: 3.5,
    color: "green",
  },
  {
    id: 4,
    name: "product 4",
    price: 49.99,
    image: "",
    description: "this is a description for product 4.",
    category: ["animals"],
    size: 4.5,
    color: "blue",
  },
  {
    id: 5,
    name: "product 5",
    price: 59.99,
    image: "",
    description: "this is a description for product 5.",
    category: ["anime"],
    size: 5.5,
    color: "red",
  },
  {
    id: 6,
    name: "product 6",
    price: 69.99,
    image: "",
    description: "this is a description for product 6.",
    category: ["anime"],
    size: 6.5,
    color: "green",
  },
  {
    id: 7,
    name: "product 7",
    price: 79.99,
    image: "",
    description: "this is a description for product 7.",
    category: ["animals"],
    size: 7.5,
    color: "red",
  },
  {
    id: 8,
    name: "product 8",
    price: 89.99,
    image: "",
    description: "this is a description for product 8.",
    category: ["anime"],
    size: 8.5,
    color: "blue",
  },
  {
    id: 9,
    name: "product 9",
    price: 99.99,
    image: "",
    description: "this is a description for product 9.",
    category: ["anime"],
    size: 9.5,
    color: "green",
  },
  {
    id: 10,
    name: "product 10",
    price: 109.99,
    image: "",
    description: "this is a description for product 10.",
    category: ["animals"],
    size: 0.5,
    color: "red",
  },
  {
    id: 11,
    name: "product 11",
    price: 119.99,
    image: "",
    description: "this is a description for product 11.",
    category: ["anime"],
    size: 1.5,
    color: "blue",
  },
  {
    id: 12,
    name: "product 12",
    price: 129.99,
    image: "",
    description: "this is a description for product 12.",
    category: ["anime"],
    size: 2.5,
    color: "green",
  },
];

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
      <ProductGrid products={products} />
      <div className="grow flex justify-center items-center h-100">sex</div>
    </>
  );
}

export default LandingPage;
