import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "support_engineer", label: "Support Engineer" },
  { value: "customer", label: "Customer" },
  { value: "admin", label: "Admin" },
];

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists → edit mode

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  // Fetch user details if editing
  const fetchUser = async () => {
    try {
      const response = await API.get(`/users/${id}`);
      setFormData(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Unable to load this user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

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
      setError(error.response?.data?.error || "Unable to save user.");
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading user...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? "Edit User" : "Add New User"}</h2>

      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px" }}
      >
        {error ? <div className="alert alert-danger">{error}</div> : null}

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
            {ROLE_OPTIONS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
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
