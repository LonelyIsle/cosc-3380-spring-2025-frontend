import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@assets/bag-full-logo.svg";
import axios from "axios";

function Fpassword() {
  const [email, setEmail] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reset_password_answer, Set_reset_password_answer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/forget/question`,
        { email }
      );
      if (response.data.message === "success") {
        console.log(response.data.data.reset_password_question);
        setSecretQuestion(response.data.data.reset_password_question);
        setShowModal(true);
      } else {
        setErrorMessage("Email Not Found.");
      }
    } catch (error) {
      setErrorMessage(
        "Email is incorrect, or An error occurred. Please try again later."
      );
    }
  };

  const handleAnswerSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    console.log("Submitting answer:", {
      email,
      reset_password_answer,
      password,
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/customer/forget`,
        { email, reset_password_answer, password }
      );

      console.log("Response from answer submit:", response.data);
      console.log(response, "Secret Answer");
      if (response.data.message === "success") {
        setSuccessMessage("Answer correct. Redirecting...");
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setErrorMessage("Incorrect answer. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="center-container">
      <div className="p-6 bg-mantle text-text rounded-xl shadow-lg">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-40 h-40" />
        </div>
        <h1 className="text-lg font-bold mb-3 text-subtext1">Reset Password</h1>
        <form onSubmit={handleSubmit}>
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
              required
            />
          </div>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          <div className="mt-6 text-center">
            <button className="bg-maroon text-base py-2 px-4 rounded hover:bg-peach">
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-maroon bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base p-6 rounded-lg shadow-xl w-96 text-text">
            <h2 className="text-xl font-semibold mb-4">
              Answer Security Question
            </h2>
            <p className="mb-2">{secretQuestion}</p>
            <form onSubmit={handleAnswerSubmit}>
              <input
                type="text"
                className="border p-2 w-full rounded mb-4 bg-surface2 text-text"
                placeholder="Enter your answer"
                value={reset_password_answer}
                onChange={(e) => Set_reset_password_answer(e.target.value)}
                required
              />
              {errorMessage && (
                <p className="text-red-500 mb-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 mb-2">{successMessage}</p>
              )}
              <p className="mb-2"> New Password</p>
              <input
                type="password"
                className="border p-2 w-full rounded mb-4 bg-surface2 text-text"
                placeholder="Enter your answer"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errorMessage && (
                <p className="text-red-500 mb-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 mb-2">{successMessage}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-maroon text-white px-4 py-2 rounded hover:bg-peach"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fpassword;
