import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { BASE_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 

const Profile = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const [petitions, setPetitions] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedResponse, setExpandedResponse] = useState({});

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    if (!authToken || role !== 'PETITIONER') {
      return navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getUserPetitions();
  }, []);

  const getUserPetitions = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(`${BASE_URL}/petition/petitions/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setPetitions(res.data || []);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch your petitions. Please try again.',
      });
      console.log(error);
    }
  };

  const toggleReadMore = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleResponseReadMore = (id) => {
    setExpandedResponse((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncateContent = (content, isExpanded) => {
    const charLimit = 50; 
    if (isExpanded || !content || content.length <= charLimit) {
      return content;
    }
    return `${content.slice(0, charLimit)}...`;
  };

  return (
    <div className="">
      <Sidebar isAdmin={false} />
      <div className="flex-1 p-5">
        <h2 className="text-2xl font-bold mb-5">My Petitions</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Petition Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Petition Description</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">Signatures</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">Response</th>
                </tr>
              </thead>
              <tbody>
                {petitions?.map((petition, index) => (
                  <tr className="border-b" key={index}>
                    <td className="px-6 py-4 text-sm text-gray-800">{petition.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 break-normal max-w-xs">
                      {truncateContent(petition.content, expandedRows[petition.id])}
                      {petition.content && petition.content.length > 50 && (
                        <button
                          onClick={() => toggleReadMore(petition.id)}
                          className="text-blue-500 underline ml-2"
                        >
                          {expandedRows[petition.id] ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">{petition.signatures}</td>
                    <td className="px-6 py-4 text-center">
                      {petition.status === "CLOSED" ? (
                        <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded-lg">Closed</span>
                      ) : (
                        <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-lg">Open</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 break-normal max-w-xs">
                      {truncateContent(petition.response, expandedResponse[petition.id])}
                      {petition.response && petition.response.length > 50 && (
                        <button
                          onClick={() => toggleResponseReadMore(petition.id)}
                          className="text-blue-500 underline ml-2"
                        >
                          {expandedResponse[petition.id] ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;