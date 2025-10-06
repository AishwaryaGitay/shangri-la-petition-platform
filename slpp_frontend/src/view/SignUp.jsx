import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import axios from "axios";
import { BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dob: "",
    bioId: "",
    password: "",
  });

  const [showScanner, setShowScanner] = useState(false); 
  const [errors, setErrors] = useState({}); 

  const videoRef = useRef(null);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && day < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    let scanner = null;

    if (showScanner && videoRef.current) {
      scanner = new QrScanner(videoRef.current, (result) => {
        console.log("Scanned successfully:", result);

        setFormData((prevFormData) => ({
          ...prevFormData,
          bioId: result,
        }));

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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!formData.email) {
      formIsValid = false;
      errors["email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      errors["email"] = "Email is invalid";
    }

    const age = calculateAge(formData.dob);
    if (!formData.dob) {
      formIsValid = false;
      errors["dob"] = "Date of birth is required";
    } else if (age < 18) {
      formIsValid = false;
      errors["dob"] = "You must be at least 18 years old";
    }

    if (!formData.bioId) {
      formIsValid = false;
      errors["bioId"] = "Bio ID is required";
    } else if (formData.bioId.length < 5) {
      formIsValid = false;
      errors["bioId"] = "Bio ID must be at least 5 characters long";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const body = {
        emailId: formData.email,
        petitionerFullName: formData.username,
        birthDate: formData.dob,
        password: formData.password,
        biometricId: formData.bioId,
      };
      console.log(body);
      const response = await axios.post(`${BASE_URL}/petitioner/register`, body);
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User registered successfully!',
      });
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data;
        if (errorMessage.includes("Invalid BioID")) {
          setErrors({ bioId: "Invalid Bio ID. Please check and try again." });
        } else if (errorMessage.includes("BioID has already been used")) {
          setErrors({ bioId: "Bio ID has already been used. Please use a different Bio ID." });
        } else if (errorMessage.includes("Email is already registered")) {
          setErrors({ email: "Email is already registered. Please use a different email." });
        } else {
          setErrors({ general: "Invalid input data. Please check your details." });
        }
      } else if (error.response && error.response.status === 409) {
        setErrors({ general: "Email or BioID already in use. Please use different credentials." });
      } else {
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
      console.error("Error during sign up:", error.response?.data?.message || error.message);
    }
  };

  const handleCloseQrPopup = () => {
    setShowScanner(false);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Petitioner Sign Up</h2>

        {errors.general && (
          <div className="mb-4 text-red-600">{errors.general}</div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800">Username</label>
          <input
            type="text"
            name="username"
            className="w-full px-4 py-2 border rounded-lg mt-2"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
        </div>
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
          {errors.email && (
            <div className="text-red-600">{errors.email}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800">Date of Birth</label>
          <input
            type="date"
            name="dob"
            className="w-full px-4 py-2 border rounded-lg mt-2"
            value={formData.dob}
            onChange={handleInputChange}
          />
          {errors.dob && (
            <div className="text-red-600">{errors.dob}</div>
          )}
        </div>
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-800">Bio ID</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="bioId"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.bioId}
              onChange={handleInputChange}
              placeholder="Enter your Bio ID"
            />
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-400"
              onClick={() => setShowScanner(true)}
            >
              Scan QR
            </button>
          </div>
          {errors.bioId && (
            <div className="text-red-600">{errors.bioId}</div>
          )}
        </div>

        <button
          className="bg-[#CC8899] text-white px-4 py-2 rounded-lg hover:bg-[#AB4E52] w-full"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>
      <div className="text-right mt-4">
        <span>Already have an account? <Link to="/" className="text-blue-700 underline"> Sign in</Link></span>
      </div>
      
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

export default SignUp;