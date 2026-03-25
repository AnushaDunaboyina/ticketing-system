import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/WorkspacePages.css";

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await API.get("/users");
        setUsers(Array.isArray(response.data) ? response.data : []);
        setError("");
      } catch (fetchError) {
        console.error("Error fetching users:", fetchError);
        setUsers([]);
        setError("Unable to load users right now.");
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    } catch (deleteError) {
      console.error("Error deleting user:", deleteError);
      setError(deleteError.response?.data?.error || "Unable to delete this user.");
    }
  };

  const supportCount = users.filter((user) => user.role === "support_engineer").length;
  const customerCount = users.filter((user) => user.role === "customer").length;
  const adminCount = users.filter((user) => user.role === "admin").length;

  return (
    <div className="workspace-shell">
      <section className="workspace-hero">
        <div className="workspace-hero-copy">
          <span className="workspace-eyebrow">Users</span>
          <h1 className="workspace-title">Maintain a team directory that keeps ticket ownership clear.</h1>
          <p className="workspace-subtitle">
            Every ticket flow depends on a clean list of people who can report,
            receive, and manage work across the system.
          </p>

          <div className="workspace-actions">
            <Link to="/users/new" className="workspace-btn-primary">
              Add New User
            </Link>
            <Link to="/tickets" className="workspace-btn-secondary">
              Open Ticket Queue
            </Link>
          </div>

          <div className="workspace-badge-row">
            <span className="workspace-stat-chip">
              Total <strong>{users.length}</strong>
            </span>
            <span className="workspace-stat-chip">
              Support <strong>{supportCount}</strong>
            </span>
            <span className="workspace-stat-chip">
              Customers <strong>{customerCount}</strong>
            </span>
          </div>
        </div>

        <aside className="workspace-hero-panel">
          <span className="workspace-panel-label">Directory Mix</span>
          <strong className="workspace-panel-value">{users.length}</strong>
          <p className="workspace-panel-text">people currently available in the system.</p>

          <div className="workspace-panel-list">
            <div className="workspace-panel-item">
              <span>Support Engineers</span>
              <strong>{supportCount}</strong>
            </div>
            <div className="workspace-panel-item">
              <span>Customers</span>
              <strong>{customerCount}</strong>
            </div>
            <div className="workspace-panel-item">
              <span>Admins</span>
              <strong>{adminCount}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="workspace-content-grid">
        <div className="workspace-surface">
          <div className="workspace-surface-header">
            <div>
              <h2>User Directory</h2>
              <p>Click a name to edit the profile or use the action buttons for quick management.</p>
            </div>
          </div>

          {error ? <div className="workspace-alert" style={{ marginBottom: "1rem" }}>{error}</div> : null}

          <div className="workspace-table-scroll">
            <table className="workspace-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr className="workspace-empty-row">
                    <td colSpan="5">No users have been created yet.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>
                        <button
                          className="workspace-link-button"
                          onClick={() => navigate(`/users/${user.id}`)}
                        >
                          {user.name}
                        </button>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="workspace-role-pill">{user.role.replaceAll("_", " ")}</span>
                      </td>
                      <td>
                        <div className="workspace-action-row">
                          <button
                            className="workspace-btn-secondary"
                            onClick={() => navigate(`/users/${user.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="workspace-btn-tertiary"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="workspace-surface">
          <div className="workspace-surface-header">
            <div>
              <h3>Directory Notes</h3>
              <p>Small habits here make the rest of the app feel more trustworthy.</p>
            </div>
          </div>

          <div className="workspace-tip-list">
            <div className="workspace-tip-card">
              <strong>Use real emails</strong>
              <p>They make the list easier to scan and help distinguish similar names.</p>
            </div>
            <div className="workspace-tip-card">
              <strong>Keep roles intentional</strong>
              <p>Consistent roles make assignment and presentation much easier to explain.</p>
            </div>
            <div className="workspace-tip-card">
              <strong>Delete carefully</strong>
              <p>Removing a user changes how existing ticket ownership is displayed later.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default UsersList;
