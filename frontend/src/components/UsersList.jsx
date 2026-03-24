import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";


const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await API.get("/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setError("Unable to load users right now.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.response?.data?.error || "Unable to delete this user.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Users</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/users/new")}
        >
          + Add New User
        </button>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>

                {/* Clicking name goes to edit page */}
                <td
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  {user.name}
                </td>

                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => navigate(`/users/${user.id}`)}
                    style={{ marginRight: "8px" }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
