import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bag-full-logo.svg";
import Validation from "../components/LoginValidation";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("🔐 Submitting login form");
    const validationErrors = Validation(email, password);

    if (Object.keys(validationErrors).length === 0) {
      console.log("✅ No validation errors, sending login request...");
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/login`,
          { email, password },
          { headers: { "Content-Type": "application/json" } }
        );

        const data = response.data;
        console.log("✅ Response data:", data);

        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        const role = data.user.role?.toUpperCase();
        console.log("👤 Logged in user role:", role);

        if (role === "MANAGER" || role === "STAFF") {
          console.log("🔁 Redirecting to /admin");
          navigate("/admin");
        } else {
          console.log("🛒 Redirecting to /shop");
          navigate("/shop");
        }
      } catch (err) {
        console.error("❌ Error caught in login attempt:", err);

        if (err.response) {
          console.error("❌ Backend error response:", err.response.data);
          alert(err.response.data.message || "Login failed");
        } else {
          console.error("❌ Network or unknown error:", err.message);
          alert("Network error — check your connection or try again.");
        }
      }
    }
  };

  return (
    <div className="center-container">
      <div className="p-6 bg-mantle text-text rounded-xl shadow-lg">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-64 h-64" />
        </div>
        <h1 className="text-lg font-bold mb-4 text-subtext1">Please sign in</h1>
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
          <div className="mb-2">
            <label htmlFor="password" className="block text-subtext0">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="border p-2 w-full rounded bg-surface2 text-text"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-6 text-center">
            <button className="bg-maroon text-base py-2 px-4 rounded hover:bg-peach">
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-subtext0">Don't have an account?</p>
          <button
            className="bg-green text-base py-2 px-4 rounded hover:bg-teal"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
