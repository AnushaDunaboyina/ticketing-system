import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../utils";

export default function CreateTicket() {
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

  // Fetch users from backend
  useEffect(() => {
    API.get("/users")
      .then((res) => {
        const fetchedUsers = Array.isArray(res.data) ? res.data : [];
        setUsers(fetchedUsers);
        setError("");

        // Auto-fill reporter with first user
        if (fetchedUsers.length > 0) {
          setForm((prev) => ({ 
            ...prev, 
            reporter: fetchedUsers[0].id,
            assignee: fetchedUsers[0].id 
          }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Unable to load users right now.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    // Convert numeric fields
    if (["priority", "status", "assignee", "reporter"].includes(name)) {
      parsedValue = parseInt(value) || value;
    }
    setForm({ ...form, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (users.length === 0) {
      return;
    }
    try {
      const submitForm = {
        ...form,
        priority: parseInt(form.priority),
        status: parseInt(form.status),
        assignee: parseInt(form.assignee),
        reporter: parseInt(form.reporter),
      };
      await API.post("/tickets", submitForm);
      alert("Ticket created successfully!");
      // Reset form
      setForm({
        title: "",
        description: "",
        priority: 1,
        status: 1,
        assignee: "",
        reporter: "",
      });
    } catch (err) {
      console.error("Error creating ticket:", err);
      alert("Failed to create ticket: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading users...</div>;
  }

  if (users.length === 0) {
    return (
      <div className="container mt-4">
        <div className="card p-4 shadow-sm">
          <h2 className="mb-3">Create Ticket</h2>
          <p className="text-muted mb-3">
            Create at least one user first so you can choose an assignee and reporter.
          </p>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          <div className="d-flex gap-2">
            <Link to="/users/new" className="btn btn-primary">
              Add First User
            </Link>
            <Link to="/users" className="btn btn-outline-secondary">
              View Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Create Ticket</h2>

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              className="form-select"
              value={form.priority}
              onChange={handleChange}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={form.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assignee Dropdown */}
        <div className="mb-3">
          <label className="form-label">Assignee</label>
          <select
            name="assignee"
            className="form-select"
            value={String(form.assignee)}
            onChange={handleChange}
            required
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reporter Dropdown */}
        <div className="mb-3">
          <label className="form-label">Reporter</label>
          <select
            name="reporter"
            className="form-select"
            value={String(form.reporter)}
            onChange={handleChange}
            required
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary mt-2">Create Ticket</button>
      </form>
    </div>
  );
}
