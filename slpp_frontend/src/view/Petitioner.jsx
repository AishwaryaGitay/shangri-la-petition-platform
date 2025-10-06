import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { BASE_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 

const Petitioner = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const [showModal, setShowModal] = useState(false);
  const [petitionTitle, setPetitionTitle] = useState("");
  const [petitionDescription, setPetitionDescription] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedResponse, setExpandedResponse] = useState({});
  const [petition, setPetition] = useState([]);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    if (!authToken || role !== 'PETITIONER') {
      return navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getAllPetition();
  }, []);

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
    if (isExpanded || content?.length <= charLimit) {
      return content;
    }
    return `${content?.slice(0, charLimit) || '-'}`;
  };

  const getAllPetition = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(`${BASE_URL}/petition/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setPetition(res.data || []);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch petitions. Please try again.',
      });
      console.log(error);
    }
  };

  const handleAddPetition = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const userId = localStorage.getItem('userId'); 
  
      const body = {
        petitionTitle,
        petitionContent: petitionDescription,
        petitionerId: userId, 
      };
  
      const response = await axios.post(`${BASE_URL}/petition/create`, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.status === 201) { 
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Petition created successfully!',
        });
        getAllPetition();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid petition data',
            text: error.response.data.message,
          });
        } else if (error.response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'Please log in again.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Unexpected error',
            text: error.response.data.message,
          });
        }
      } else if (error.request) {
        Swal.fire({
          icon: 'error',
          title: 'Network error',
          text: 'Please check your internet connection.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
      console.log(error);
    } finally {
      setShowModal(false);
      setPetitionTitle("");
      setPetitionDescription("");
    }
  };

  const handleSignPetition = async (data) => {
    try {
      const userId = localStorage.getItem('userId');
      const authToken = localStorage.getItem('authToken');
  
      if (data.petitionerId === parseInt(userId)) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You cannot sign your own petition',
        });
      }
  
      if (data.signatureThreshold === data.signatures) {
        return Swal.fire({
          icon: 'error',
          title: 'Limits Reached',
          text: 'Limits Reached',
        });
      }
  
      const body = {
        petitionId: data.id,
        petitionerId: userId,
        title: data.title,
        content: data.content,
        status: data.status,
        response: data.response,
        signatureCount: data.signatures,
        signatureThreshold: data.signatureThreshold
      };
  
      const response = await axios.post(`${BASE_URL}/petition/sign`, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Signed successfully!',
        });
        getAllPetition();
      }
  
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (error.response.status === 500 && errorMessage.includes("You have already signed this petition")) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'You have already signed this petition',
          });
        } else if (error.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid request',
            text: errorMessage,
          });
        } else if (error.response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'Please log in again.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
        }
      } else if (error.request) {
        Swal.fire({
          icon: 'error',
          title: 'Network error',
          text: 'Please check your internet connection.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
      console.log(error);
    }
  };

  return (
    <div className="">
      <Sidebar isAdmin={false} />
      <div className="flex-1 p-5">
        <div className="flex justify-between items-center mb-5">
          <button
            className="bg-[#CC8899] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#AB4E52]"
            onClick={() => setShowModal(true)}
          >
            Add New Petition +
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Created By</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Petition Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Petition Description</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">Signatures</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">Actions</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">Response</th>
                </tr>
              </thead>
              <tbody>
                {petition?.map((pet, index) => (
                  <tr className="border-b" key={index}>
                    <td className="px-6 py-4 text-sm text-gray-800">{pet.petitionerName || "yash"}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{pet.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 break-normal max-w-xs">
                      {truncateContent(pet.content, expandedRows[pet.id])}
                      {pet.content.length > 50 && (
                        <button
                          onClick={() => toggleReadMore(pet.id)}
                          className="text-blue-500 underline ml-2"
                        >
                          {expandedRows[pet.id] ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">{pet.signatures}/{pet.signatureThreshold}</td>
                    <td className="px-6 py-4 text-center">
                      {pet.status === "CLOSED" ? (
                        <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded-lg">Closed</span>
                      ) : (
                        <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-lg">Open</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className={`bg-[#CC8899] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#AB4E52] ${pet.status === "CLOSED" ? "opacity-50 cursor-not-allowed" : ""}`}
                        style={{ cursor: pet.status === "CLOSED" ? "not-allowed" : "pointer" }}
                        disabled={pet.status === "CLOSED" || pet.petitionerId === userId}
                        onClick={() => pet.status !== "CLOSED" && handleSignPetition(pet)}
                      >
                        Sign
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 break-normal max-w-xs">
                      {truncateContent(pet?.response, expandedResponse[pet?.id])}
                      {pet?.response?.length > 50 && (
                        <button
                          onClick={() => toggleResponseReadMore(pet.id)}
                          className="text-blue-500 underline ml-2"
                        >
                          {expandedResponse[pet.id] ? "Show Less" : "Read More"}
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Add New Petition</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800">Petition Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg mt-2"
                value={petitionTitle}
                onChange={(e) => setPetitionTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800">Petition Description</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg mt-2"
                value={petitionDescription}
                onChange={(e) => setPetitionDescription(e.target.value)}
                placeholder="Enter description"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#CC8899] text-white px-4 py-2 rounded-lg hover:bg-[#AB4E52]"
                onClick={handleAddPetition}
                disabled={loading} 
              >
                {loading ? 'Adding...' : 'Add Petition'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Petitioner;