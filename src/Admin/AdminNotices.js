import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";


const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ text: "", link: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notices`, {
        credentials: 'include', // Important for cookies or sessions
      });
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notices`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: 'include', // Important for cookies or sessions        
        body: JSON.stringify(newNotice),
      });
      if (response.ok) {
        setNewNotice({ text: "", link: "" });
        fetchNotices();
      }
    } catch (error) {
      console.error("Error creating notice:", error);
    }
  };

  const handleDeleteNotice = async (id) => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/notices/${id}`, {
        method: "DELETE",
        credentials: 'include', // Important for cookies or sessions
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      fetchNotices(); // Refresh the notices after successful deletion
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };


  return (
    <>
      <div>
        <h2>Admin Notice Management</h2>

        <div>
          <h3>Create Notice</h3>
          <input
            type="text"
            placeholder="Notice Text"
            value={newNotice.text}
            onChange={(e) => setNewNotice({ ...newNotice, text: e.target.value })}
          />
          <input
            type="text"
            placeholder="Optional Link"
            value={newNotice.link}
            onChange={(e) => setNewNotice({ ...newNotice, link: e.target.value })}
          />
          <button onClick={handleCreateNotice}>Add Notice</button>
        </div>

        <div>
          <h3>Existing Notices</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {notices.map((notice) => (
                <li key={notice._id}>
                  <strong>{notice.text}</strong> {notice.link && ` - ${notice.link}`}
                  <button onClick={() => handleDeleteNotice(notice._id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* back btn */}
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Back
      </button>
    </>
  );
};

export default AdminNotices;
