import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const PRIORITY_OPTIONS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

const STATUS_OPTIONS = [
  { value: 1, label: "Open" },
  { value: 2, label: "In Progress" },
  { value: 3, label: "Resolved" },
];

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

  // Fetch ticket + users
  useEffect(() => {
    async function fetchData() {
      try {
        const [ticketRes, usersRes] = await Promise.all([
          API.get(`/tickets/${id}`),
          API.get("/users"),
        ]);

        setUsers(usersRes.data);

        // Pre-fill form with ticket data
        const t = ticketRes.data;
        setForm({
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status,
          assignee: t.assignee,
          reporter: t.reporter,
        });
      } catch (err) {
        console.error("Error loading ticket:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/tickets/${id}`, form);
      alert("Ticket updated successfully");
      navigate(`/ticket/${id}`);
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("Failed to update ticket");
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Edit Ticket #{id}</h2>

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
            value={form.assignee}
            onChange={handleChange}
            required
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
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
            value={form.reporter}
            onChange={handleChange}
            required
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary mt-2">Save Changes</button>
      </form>
    </div>
  );
}