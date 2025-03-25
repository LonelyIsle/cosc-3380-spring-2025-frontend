import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bag-full-logo.svg";
import Validation from "../components/RegisterValidation";
import axios from "axios";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(email, password, confirmPassword);
    setErrors(validationErrors);

    if (
      !validationErrors.passwordcheck &&
      !validationErrors.email &&
      !validationErrors.password
    )
      axios
        .post(`${import.meta.env.VITE_API_URL}/register`, {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          address,
          email,
          password,
        })
        .then((res) => {
          console.log("Registration success:", res.data);
          navigate("/");
        })
        .catch((err) => {
          console.error(
            "Registration failed:",
            err.response?.data || err.message
          );
        });
  };
  return (
    <div className="center-container">
      <div className="p-6 bg-mantle text-text rounded-xl shadow-lg min-w-[200px] min-h-[150px] sm:min-w-[300px] sm:min-h-[200px] md:min-w-[400px] md:min-h-[250px] lg:min-w-[500px] lg:min-h-[300px] xl:min-w-[600px] xl:min-h-[350px] mx-auto my-4">
        <h1 className="text-lg font-bold mb-4 text-subtext1">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-48 h-32" />
          </div>
          Register your account
        </h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="Fname" className="block text-subtext0">
              First Name:
            </label>
            <input
              name="passwordcheck"
              type="text"
              id="Fname"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="Mname" className="block text-subtext0">
              Middle Name:
            </label>
            <input
              type="text" // Corrected type to text
              id="Mname"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="Lname" className="block text-subtext0">
              Last Name:
            </label>
            <input
              type="text" // Corrected type to text
              id="Lname"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="block text-subtext0">
              Email:
            </label>
            <input
              name="email"
              type="email"
              id="email"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span
                className="text-red-700 px-2 py-1 rounded relative"
                role="alert"
              >
                {errors.email}
              </span>
            )}
          </div>
          <div className="mb-2">
            <label name="password" className="block text-subtext0">
              Password:
            </label>
            <input
              name="password"
              type="password"
              id="password"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span
                className="text-red-700 px-2 py-1 rounded relative"
                role="alert"
              >
                {errors.password}
              </span>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="Cpassword" className="block text-subtext0">
              Confirm Password:
            </label>
            <input
              name="cpassword"
              type="password" //Corrected type
              id="Cpassword"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Confirm Password"
              value={confirmPassword} // set the value
              onChange={(e) => setConfirmPassword(e.target.value)} // set the state
            />
            {errors.passwordcheck && (
              <span
                className="text-red-700 px-2 py-1 rounded relative"
                role="alert"
              >
                {errors.passwordcheck}
              </span>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="address" className="block text-subtext0">
              Address:
            </label>
            <input
              name="address"
              type="text" //Corrected type
              id="address"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-green text-base py-2 px-4 rounded hover:bg-teal"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
