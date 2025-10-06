import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import axios from "axios";
import { BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showScanner, setShowScanner] = useState(false); // Toggle QR scanner
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message

  const videoRef = useRef(null);

  useEffect(() => {
    let scanner = null;

    if (showScanner && videoRef.current) {
      scanner = new QrScanner(videoRef.current, async (result) => {
        console.log("Scanned successfully:", result);
        await handleScan(result);

        setShowScanner(false);
      });
      scanner.start();
    }

    return () => {
      if (scanner) {
        scanner.stop();
      }
    };
  }, [showScanner]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScan = async (result) => {
    if (result) {
      try {
        const response = await axios.post(`${BASE_URL}/qr-login`, {
          bioId: result,
        });
        localStorage.setItem("authToken", response.data.access_token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userName", response.data.fullName);
        setShowScanner(false); // Close scanner
        navigate("/petitioner/dashboard");
      } catch (error) {
        setErrorMessage("Invalid QR Code format or BioID not found");
        console.error("Error during QR login:", error.response?.data?.message || error.message);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const body = {
        email: formData.email,
        password: formData.password,
        role: "PETITIONER",
      };
      const response = await axios.post(`${BASE_URL}/login`, body);
      localStorage.setItem("authToken", response.data.access_token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userName", response.data.fullName);

      navigate("/petitioner/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Error during sign in:", error.response?.data?.message || error.message);
    }
  };

  const handleCloseQrPopup = () => {
    setShowScanner(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full lg:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden mb-12">

        {/* Side Panel with Information */}
        <div className="hidden lg:block lg:w-1/3 p-6 bg-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SLPP – Your Voice, Your Power!</h1>
          <p className="text-md text-gray-700">
The Shangri-La Petition Platform (SLPP) is a transformative space where the citizens of the Valley of Shangri-La can actively shape parliamentary discussions and influence change.
<br /><br />
This platform empowers you to:
<ul className="list-disc pl-5">
              <li>Create petitions on issues that matter to you and your community.</li>
              <li>Sign petitions to support causes aligned with your values.</li>
            </ul>
            <br /><br />
          </p>
        </div>

        {/* Sign In Form */}
        <div className="w-full lg:w-2/3 p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Petitioner Sign In</h2>

          {errorMessage && (
            <div className="mb-4 text-red-600">{errorMessage}</div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg mt-2"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg mt-2"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </div>

          {/* Sign In Button */}
          <button
            className="bg-[#CC8899] text-white px-4 py-2 rounded-lg hover:bg-[#AB4E52] w-full"
            onClick={handleSignIn}
          >
            Sign In
          </button>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-4">
            <span className="border-t flex-grow border-gray-300"></span>
            <span className="mx-2 text-gray-600">OR</span>
            <span className="border-t flex-grow border-gray-300"></span>
          </div>

          {/* Sign In Using QR Code */}
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 w-full"
            onClick={() => setShowScanner(true)}
          >
            Sign In Using QR Code
          </button>

          <div className="text-right mt-4">
            <span>
              Don't have an account? <Link to="/signup" className="text-blue-700 underline">Sign up</Link>
            </span>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-3/4 max-w-md p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
            <button
              onClick={handleCloseQrPopup}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300"
            >
              ✕
            </button>
            <h3 className="mb-4 text-lg font-bold text-center text-navy-700 dark:text-white">
              Scan QR Code
            </h3>
            <video
              ref={videoRef}
              className="rounded-lg"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;