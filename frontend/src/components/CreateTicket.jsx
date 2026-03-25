import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../utils";
import "../styles/WorkspacePages.css";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: 1,
    status: 1,
    assignee: 0,
    reporter: 0,
  });

  useEffect(() => {
    API.get("/users")
      .then((response) => {
        const fetchedUsers = Array.isArray(response.data) ? response.data : [];
        setUsers(fetchedUsers);
        setError("");

        if (fetchedUsers.length > 0) {
          setForm((previous) => ({
            ...previous,
            reporter: fetchedUsers[0].id,
            assignee: fetchedUsers[0].id,
          }));
        }
      })
      .catch((fetchError) => {
        console.error("Error fetching users:", fetchError);
        setError("Unable to load users right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
    if (users.length === 0) {
      return;
    }

    try {
      await API.post("/tickets", {
        ...form,
        priority: parseInt(form.priority),
        status: parseInt(form.status),
        assignee: parseInt(form.assignee),
        reporter: parseInt(form.reporter),
      });

      navigate("/tickets");
    } catch (submitError) {
      console.error("Error creating ticket:", submitError);
      setError(submitError.response?.data?.error || "Unable to create the ticket.");
    }
  };

  if (loading) {
    return <div className="workspace-shell">Loading users...</div>;
  }

  if (users.length === 0) {
    return (
      <div className="workspace-shell">
        <section className="workspace-hero">
          <div className="workspace-hero-copy">
            <span className="workspace-eyebrow">New Ticket</span>
            <h1 className="workspace-title">Create the people first, then route the work with confidence.</h1>
            <p className="workspace-subtitle">
              Tickets need a reporter and assignee, so add at least one user to
              unlock the form and keep ownership clear from the start.
            </p>
            <div className="workspace-actions">
              <Link to="/users/new" className="workspace-btn-primary">
                Add First User
              </Link>
              <Link to="/users" className="workspace-btn-secondary">
                View Users
              </Link>
            </div>
          </div>

          <aside className="workspace-hero-panel">
            <span className="workspace-panel-label">Form Status</span>
            <strong className="workspace-panel-value">Waiting</strong>
            <p className="workspace-panel-text">The ticket form unlocks as soon as a user exists.</p>
          </aside>
        </section>

        <section className="workspace-surface">
          <div className="workspace-empty">
            Create at least one user first so you can choose an assignee and reporter.
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
          <span className="workspace-eyebrow">New Ticket</span>
          <h1 className="workspace-title">Capture the issue with enough detail for the team to act fast.</h1>
          <p className="workspace-subtitle">
            A strong ticket gives the queue context, ownership, and the right
            urgency so support work does not stall after handoff.
          </p>

          <div className="workspace-actions">
            <Link to="/tickets" className="workspace-btn-secondary">
              Back to Tickets
            </Link>
            <Link to="/users/new" className="workspace-btn-tertiary">
              Add User
            </Link>
          </div>

          <div className="workspace-badge-row">
            <span className="workspace-stat-chip">
              Available Users <strong>{users.length}</strong>
            </span>
            <span className="workspace-stat-chip">
              Default Status <strong>Open</strong>
            </span>
            <span className="workspace-stat-chip">
              Queue Entry <strong>Ready</strong>
            </span>
          </div>
        </div>

        <aside className="workspace-hero-panel">
          <span className="workspace-panel-label">Routing Notes</span>
          <strong className="workspace-panel-value">{users.length}</strong>
          <p className="workspace-panel-text">team members available for assignment right now.</p>

          <div className="workspace-panel-list">
            <div className="workspace-panel-item">
              <span>Reporter</span>
              <strong>{users.find((user) => user.id === Number(form.reporter))?.name || "Select one"}</strong>
            </div>
            <div className="workspace-panel-item">
              <span>Assignee</span>
              <strong>{users.find((user) => user.id === Number(form.assignee))?.name || "Select one"}</strong>
            </div>
            <div className="workspace-panel-item">
              <span>Priority</span>
              <strong>{PRIORITY_OPTIONS.find((option) => option.value === Number(form.priority))?.label}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="workspace-content-grid">
        <div className="workspace-surface">
          <div className="workspace-surface-header">
            <div>
              <h2>Create Ticket</h2>
              <p>Fill in the essentials so the issue can be triaged quickly.</p>
            </div>
          </div>

          <form className="workspace-form" onSubmit={handleSubmit}>
            {error ? <div className="workspace-alert">{error}</div> : null}

            <div className="workspace-field-group">
              <label htmlFor="ticket-title">Title</label>
              <input
                id="ticket-title"
                type="text"
                name="title"
                className="workspace-input"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="workspace-field-group">
              <label htmlFor="ticket-description">Description</label>
              <textarea
                id="ticket-description"
                name="description"
                className="workspace-textarea"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="workspace-form-grid">
              <div className="workspace-field-group">
                <label htmlFor="ticket-priority">Priority</label>
                <select
                  id="ticket-priority"
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
                <label htmlFor="ticket-status">Status</label>
                <select
                  id="ticket-status"
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
                <label htmlFor="ticket-assignee">Assignee</label>
                <select
                  id="ticket-assignee"
                  name="assignee"
                  className="workspace-select"
                  value={String(form.assignee)}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="workspace-field-group">
                <label htmlFor="ticket-reporter">Reporter</label>
                <select
                  id="ticket-reporter"
                  name="reporter"
                  className="workspace-select"
                  value={String(form.reporter)}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a user</option>
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
                Create Ticket
              </button>
              <Link to="/tickets" className="workspace-btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <aside className="workspace-surface">
          <div className="workspace-surface-header">
            <div>
              <h3>Helpful Checklist</h3>
              <p>A few habits that make tickets easier to triage.</p>
            </div>
          </div>

          <div className="workspace-tip-list">
            <div className="workspace-tip-card">
              <strong>Lead with the issue</strong>
              <p>Use a title that makes the problem obvious in a crowded queue.</p>
            </div>
            <div className="workspace-tip-card">
              <strong>Describe impact clearly</strong>
              <p>Explain who is affected, when it started, and what is blocked.</p>
            </div>
            <div className="workspace-tip-card">
              <strong>Assign with intent</strong>
              <p>Pick the person best positioned to triage or resolve the issue first.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
