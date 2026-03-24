import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";


const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists → edit mode

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const isEditMode = Boolean(id);

  // Fetch user details if editing
  const fetchUser = async () => {
    try {
      const response = await API.get(`/users/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await API.put(
          `/users/${id}`,
          formData
        );
      } else {
        await API.post("/users", formData);
      }

      navigate("/users"); // go back to list
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="container">
      <h2>{isEditMode ? "Edit User" : "Add New User"}</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        {/* NAME */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* ROLE */}
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* BUTTONS */}
        <button type="submit" className="btn btn-success" style={{ marginRight: "10px" }}>
          Save
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/users")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserForm;