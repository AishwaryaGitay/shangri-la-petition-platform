import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import SignIn from "./SignIn";

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  

  const handleAdminSignIn = async () => {
    try {
      const body = {
        email: email,
        password: password,
        role: "ADMIN",
      };
      const response = await axios.post(`${BASE_URL}/login`, body);
      console.log(response.data);
      localStorage.setItem("authToken", response.data.access_token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);

      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Error during sign in:", error.response?.data?.message || error.message);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  const handleModalOpen = () => {
    setShowModal(true);
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  return (
    <div className="h-screen  justify-center items-center relative">
      {/* Admin Sign In Button */}
      <button
        className="absolute top-4 right-4 bg-[#CC8899] text-white px-4 py-2 rounded-lg hover:bg-[#AB4E52]"
        onClick={handleModalOpen}
      >
        Sign In as Admin
      </button>

      {/* Petitioner Buttons */}
      <div className="space-x-4">
        <SignIn />
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Admin Sign In</h2>
            {errorMessage && (
              <div className="mb-4 text-red-600">{errorMessage}</div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-[#CC8899] text-white px-4 py-2 rounded-lg hover:bg-[#AB4E52]"
                onClick={handleAdminSignIn}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;