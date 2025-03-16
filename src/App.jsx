import { Navbar, Footer } from "./components";
import { Route, Routes } from "react-router-dom";
import { LandingPage, Login, Register } from "./pages";

function App() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      <Footer />
    </div>
  );
}

export default App;
