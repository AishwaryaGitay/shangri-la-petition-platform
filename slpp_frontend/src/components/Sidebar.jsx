import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isAdmin }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="bg-gray-800 text-white flex items-center w-full gap-4 p-3">
      {/* Title */}
      <h1 className="text-2xl font-bold mr-4">
        Shangrila {isAdmin ? "Admin Dashboard" : "Petitioner Dashboard"}
      </h1>

      <ul className="pt-1 flex gap-4">
        <li className="text-xl">
          <Link to={`${isAdmin ? "/admin/dashboard" : "/petitioner/dashboard"}`}>
            Main Dashboard
          </Link>
        </li>
        {!isAdmin && (
          <>
            <li className="text-xl">
              <span className="mx-2">|</span>
            </li>
            <li className="text-xl">
              <Link to="/petitioner/profile">
                My Petitions
              </Link>
            </li>
          </>
        )}
      </ul>

      <ul className="ml-auto flex flex-col">
        <i className="pb-2">Welcome, {userName || 'Admin'}!</i>
        <button
          className="bg-white text-gray-900 px-4 py-2 rounded-2xl hover:bg-gray-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;