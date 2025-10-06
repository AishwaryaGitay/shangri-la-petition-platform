import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "./view/Admin";
import Petitioner from "./view/Petitioner";
import Home from "./view/Home";
import SignIn from "./view/SignIn";
import SignUp from "./view/SignUp";
import Profile from "./view/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/signin" element={<SignIn />} /> */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/dashboard" element={<Admin />} />
      <Route path="/petitioner/dashboard" element={<Petitioner />} />
      <Route path="/petitioner/profile" element={<Profile />} />
    </Routes>
  );
};

export default App;
