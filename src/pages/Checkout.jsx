import { useState, useEffect } from "react";

function Checkout() {
  const isLoggedIn = false; // temporary implementation to switch between being logged in and not

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-5xl mx-auto text-center py-20">
        <p className="text-pink-500 animate-pulse font-semibold">
          Please Loggin...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <div className="bg-white rounded-lg shadow-md p-6">Ur Logged in</div>
    </div>
  );
}

export default Checkout;
