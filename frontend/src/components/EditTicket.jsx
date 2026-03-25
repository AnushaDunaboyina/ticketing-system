import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../utils";
import "../styles/WorkspacePages.css";

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: 1,
    status: 1,
    assignee: "",
    reporter: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [ticketResponse, usersResponse] = await Promise.all([
          API.get(`/tickets/${id}`),
          API.get("/users"),
        ]);

        const fetchedUsers = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const ticket = ticketResponse.data;

        setUsers(fetchedUsers);
        setForm({
          title: ticket.title,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
          assignee: ticket.assignee,
          reporter: ticket.reporter,
        });
        setError("");
      } catch (fetchError) {
        console.error("Error loading ticket:", fetchError);
        setError("Unable to load ticket details.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const parsedValue =
      ["priority", "status", "assignee", "reporter"].includes(name)
        ? parseInt(value) || value
        : value;

    setForm({ ...form, [name]: parsedValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await API.put(`/tickets/${id}`, {
        ...form,
        priority: parseInt(form.priority),
        status: parseInt(form.status),
        assignee: parseInt(form.assignee),
        reporter: parseInt(form.reporter),
      });

      navigate(`/ticket/${id}`);
    } catch (submitError) {
      console.error("Error updating ticket:", submitError);
      setError(submitError.response?.data?.error || "Unable to update the ticket.");
    }
  };

  if (loading) {
    return <div className="workspace-shell">Loading ticket...</div>;
  }

  if (users.length === 0) {
    return (
      <div className="workspace-shell">
        <section className="workspace-hero">
          <div className="workspace-hero-copy">
            <span className="workspace-eyebrow">Edit Ticket</span>
            <h1 className="workspace-title">This ticket needs a team before it can be reassigned.</h1>
            <p className="workspace-subtitle">
              Add a user first so the ticket has valid ownership fields for both
              the assignee and reporter.
            </p>
            <div className="workspace-actions">
              <Link to="/users/new" className="workspace-btn-primary">
                Add User
              </Link>
              <Link to="/users" className="workspace-btn-secondary">
                View Users
              </Link>
            </div>
          </div>

          <aside className="workspace-hero-panel">
            <span className="workspace-panel-label">Ticket</span>
            <strong className="workspace-panel-value">#{id}</strong>
            <p className="workspace-panel-text">User records are required before this ticket can be edited.</p>
          </aside>
        </section>

        <section className="workspace-surface">
          <div className="workspace-empty">
            This ticket cannot be edited until at least one user exists in the system.
          </div>
          {error ? <div className="workspace-alert" style={{ marginTop: "1rem" }}>{error}</div> : null}
        </section>
      </div>
    );
  }

  return (
    <div className="workspace-shell">
      <section className="workspace-hero">
        <div className="workspace-hero-copy">
          <span className="workspace-eyebrow">Edit Ticket</span>
          <h1 className="workspace-title">Refine the ticket so the next teammate gets cleaner context.</h1>
          <p className="workspace-subtitle">
            Update ownership, urgency, or details without losing the existing
            history and routing that are already attached to this issue.
          </p>

          <div className="workspace-actions">
            <Link to={`/ticket/${id}`} className="workspace-btn-secondary">
              View Ticket
            </Link>
            <Link to="/tickets" className="workspace-btn-tertiary">
              All Tickets
            </Link>
          </div>

          <div className="workspace-badge-row">
            <span className="workspace-stat-chip">
              Ticket <strong>#{id}</strong>
            </span>
            <span className="workspace-stat-chip">
              Status <strong>{STATUS_OPTIONS.find((option) => option.value === Number(form.status))?.label}</strong>
            </span>
            <span className="workspace-stat-chip">
              Priority <strong>{PRIORITY_OPTIONS.find((option) => option.value === Number(form.priority))?.label}</strong>
            </span>
          </div>
        </div>

        <aside className="workspace-hero-panel">
          <span className="workspace-panel-label">Current Routing</span>
          <strong className="workspace-panel-value">#{id}</strong>
          <p className="workspace-panel-text">Review who owns it and how urgent it should look in the queue.</p>

          <div className="workspace-panel-list">
            <div className="workspace-panel-item">
              <span>Assignee</span>
              <strong>{users.find((user) => user.id === Number(form.assignee))?.name || "Select one"}</strong>
            </div>
            <div className="workspace-panel-item">
              <span>Reporter</span>
              <strong>{users.find((user) => user.id === Number(form.reporter))?.name || "Select one"}</strong>
            </div>
            <div className="workspace-panel-item">
              <span>Status</span>
              <strong>{STATUS_OPTIONS.find((option) => option.value === Number(form.status))?.label}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="workspace-content-grid">
        <div className="workspace-surface">
          <div className="workspace-surface-header">
            <div>
              <h2>Edit Ticket #{id}</h2>
              <p>Adjust the details without losing the existing ticket record.</p>
            </div>
          </div>

          <form className="workspace-form" onSubmit={handleSubmit}>
            {error ? <div className="workspace-alert">{error}</div> : null}

            <div className="workspace-field-group">
              <label htmlFor="edit-ticket-title">Title</label>
              <input
                id="edit-ticket-title"
                type="text"
                name="title"
                className="workspace-input"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="workspace-field-group">
              <label htmlFor="edit-ticket-description">Description</label>
              <textarea
                id="edit-ticket-description"
                name="description"
                className="workspace-textarea"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="workspace-form-grid">
              <div className="workspace-field-group">
                <label htmlFor="edit-ticket-priority">Priority</label>
                <select
                  id="edit-ticket-priority"
                  name="priority"
                  className="workspace-select"
                  value={form.priority}
                  onChange={handleChange}
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="workspace-field-group">
                <label htmlFor="edit-ticket-status">Status</label>
                <select
                  id="edit-ticket-status"
                  name="status"
                  className="workspace-select"
                  value={form.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="workspace-form-grid">
              <div className="workspace-field-group">
                <label htmlFor="edit-ticket-assignee">Assignee</label>
                <select
                  id="edit-ticket-assignee"
                  name="assignee"
                  className="workspace-select"
                  value={String(form.assignee)}
                  onChange={handleChange}
                  required
                >
                  {users.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="workspace-field-group">
                <label htmlFor="edit-ticket-reporter">Reporter</label>
                <select
                  id="edit-ticket-reporter"
                  name="reporter"
                  className="workspace-select"
                  value={String(form.reporter)}
                  onChange={handleChange}
                  required
                >
                  {users.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="workspace-form-actions">
              <button type="submit" className="workspace-btn-primary">
                Save Changes
              </button>
              <Link to={`/ticket/${id}`} className="workspace-btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <aside className="workspace-surface">
          <div className="workspace-surface-header">
            <div>
              <h3>Edit Tips</h3>
              <p>Small improvements here make handoffs smoother later.</p>
            </div>
          </div>

          <div className="workspace-tip-list">
            <div className="workspace-tip-card">
              <strong>Keep the title stable</strong>
              <p>Change it only if the issue has materially shifted or been clarified.</p>
            </div>
            <div className="workspace-tip-card">
              <strong>Update the owner deliberately</strong>
              <p>Reassignment should signal who is accountable for the next action.</p>
            </div>
            <div className="workspace-tip-card">
              <strong>Close the loop in the description</strong>
              <p>Add context that explains what changed or why the priority moved.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
