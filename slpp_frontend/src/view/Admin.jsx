import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 

const ResponseModal = ({ isOpen, onClose, response, onSave }) => {
  const [text, setText] = useState(response);

  useEffect(() => {
    if (isOpen) {
      setText(response); 
    }
  }, [response, isOpen]);

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Response</h2>
        <textarea
          className="w-full p-2 border rounded-lg"
          rows="10"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#CC8899] text-white px-4 py-2 rounded-lg hover:bg-[#AB4E52]"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [threshold, setThreshold] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [responses, setResponses] = useState({}); 
  const [petition, setPetition] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentPetitionId, setCurrentPetitionId] = useState(null); 
  const [currentResponse, setCurrentResponse] = useState(""); 
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); 

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    if (!authToken || role !== "ADMIN") {
      return navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    getAllPetition();
  }, []);

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

  const handleUpdateThreshold = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/admin/petitions/update-threshold?threshold=${threshold}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Threshold updated successfully!',
      });
      setThreshold(response.data.updatedThreshold);
      getAllPetition();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update threshold. Please try again.',
      });
      console.log(error);
    }
  };

  const handleRespond = async (data) => {
    const token = localStorage.getItem("authToken");
    try {
      const body = {
        petitionId: data.id,
        response: responses[data.id], 
      };
      const res = await axios.post(
        `${BASE_URL}/admin/petition/respond`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Response added successfully!',
      });
      getAllPetition();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add response. Please try again.',
      });
      console.log(error);
    }
  };

  const handleResponseClick = (petitionId, response) => {
    setCurrentPetitionId(petitionId);
    setCurrentResponse(response);
    setIsModalOpen(true);
  };

  const handleModalSave = (newResponse) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [currentPetitionId]: newResponse,
    }));
  };

  const handleResponseChange = (e, petitionId) => {
    setResponses({
      ...responses,
      [petitionId]: e.target.value, 
    });
  };

  const toggleDescription = (petitionId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [petitionId]: !prev[petitionId],
    }));
  };

  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  const filteredPetitions = petition.filter((pet) =>
    pet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen">
      <Sidebar isAdmin={true} />
      <div className="flex-1 p-5">
        <div className="mb-5">
          <div className="flex items-center">
            <input
              type="number"
              className="border px-4 py-2 rounded-lg text-sm"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="Enter global threshold"
            />
            <button
              className="bg-[#CC8899] text-white px-4 py-2 ml-4 rounded-lg hover:bg-[#AB4E52]"
              onClick={handleUpdateThreshold}
            >
              Update Threshold
            </button>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center">
            <input
              type="text"
              className="border px-4 py-2 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search petitions"
              style={{ width: '250px' }} 
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">
                    Petition Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">
                    Petition Description
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">
                    Signatures
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-800">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPetitions?.map((pet) => (
                  <tr className="border-b" key={pet.id}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {pet.petitionerName || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {pet.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {expandedDescriptions[pet.id] ? pet.content : truncateText(pet.content, 100)}
                      {pet.content.length > 100 && (
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() => toggleDescription(pet.id)}
                        >
                          {expandedDescriptions[pet.id] ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">
                      {pet.signatures}/{pet.signatureThreshold}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {pet.status === "OPEN" ? (
                        <span className="text-xs bg-green-200 text-red-700 px-2 py-1 rounded-lg">
                          {pet.status}
                        </span>
                      ) : (
                        <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded-lg">
                          {pet.status}
                        </span>
                      )}
                    </td>
                    <td className="flex px-6 py-4 text-center">
                      <input
                        type="text"
                        className="border px-2 py-1 rounded-lg text-sm"
                        value={responses[pet.id] || pet.response} 
                        onClick={() => handleResponseClick(pet.id, responses[pet.id] || pet.response)}
                        readOnly 
                        placeholder="Enter response"
                      />
                      <button
                        className="bg-[#CC8899] text-white px-4 py-2 ml-2 rounded-lg hover:bg-[#AB4E52]"
                        onClick={() => handleRespond(pet)}
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ResponseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          response={currentResponse}
          onSave={handleModalSave}
        />
      </div>
    </div>
  );
};

export default Admin;