import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bag-full-logo.svg";
import Validation from "../components/LoginValidation";
import axios from "axios";

function Fpassword() {
  const [email, setEmail] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);
  //https://poswebapp-d8f0geh5dyhfgyfj.centralus-01.azurewebsites.net/

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/forget/question`,
        { email }
      );
      console.log(response.data.message);
      if (response.data.message == "success") {
      setShowModal(true)
      } else {
        setErrorMessage("Email Not Found.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="center-container">
      <div className="p-6 bg-mantle text-text rounded-xl shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-64 h-64" />
        </div>
        <h1 className="text-lg font-bold mb-4 text-subtext1">Reset Password</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="email" className="block text-subtext0">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-6 text-center">
            <button className="bg-maroon text-base py-2 px-4 rounded hover:bg-peach">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Fpassword;
