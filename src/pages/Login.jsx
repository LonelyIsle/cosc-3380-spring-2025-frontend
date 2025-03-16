import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="center-container bg-flamingo">
      <div className="p-6 bg-mantle text-text rounded-xl shadow-lg">
        <h1 className="text-lg font-bold mb-4 text-subtext1">Please sign in</h1>
        <form>
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
          <div className="mt-4 flex space-x-4">
            <button className="bg-maroon text-base py-2 px-4 rounded  hover:bg-peach">
              Sign In
            </button>
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
        </form>
      </div>
    </div>
  );
}

export default Login;
