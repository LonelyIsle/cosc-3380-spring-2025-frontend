import React from "react";
import logo from "../assets/bag-full-logo.svg";
function Register() {
  return (
    <div className="center-container">
      <div className="p-6 bg-mantle text-text rounded-xl shadow-lg">
        <h1 className="text-lg font-bold mb-4 text-subtext1">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-48 h-32" />
          </div>
          Register your account
        </h1>
        <form>
          <div className="mb-2">
            <label htmlFor="Fname" className="block text-subtext0">
              First Name:
            </label>
            <input
              type="Fname"
              id="Fname"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter First Name"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="Mname" className="block text-subtext0">
              Middle Name:
            </label>
            <input
              type="Mname"
              id="Mname"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Middle Name"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="Lname" className="block text-subtext0">
              Last Name:
            </label>
            <input
              type="Lname"
              id="Lname"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Last Name"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-subtext0">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Email"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="block text-subtext0">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Password"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="Cpassword" className="block text-subtext0">
              Confirm Password:
            </label>
            <input
              type="Cpassword"
              id="Cpassword"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Confirm Password"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="address" className="block text-subtext0">
              Address:
            </label>
            <input
              type="address"
              id="address"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Adress"
            />
          </div>
          <div className="mt-6 text-center">
            <button className="bg-green text-base py-2 px-4 rounded hover:bg-teal">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
