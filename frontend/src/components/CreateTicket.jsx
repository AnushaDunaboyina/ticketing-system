import { useEffect, useState } from "react";
import API from "../api";

const PRIORITY_MAP = {
  1: "Low",
  2: "Medium",
  3: "High",
};

const STATUS_MAP = {
  1: "Open",
  2: "In Progress",
  3: "Resolved",
};


export default function CreateTicket() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: 1,
    status: 1,
    assignee: "",
    reporter: "",
  });

  // Fetch users from backend
  useEffect(() => {
    API.get("/users")
      .then((res) => {
        setUsers(res.data);

        // Auto-fill reporter with first user
        if (res.data.length > 0) {
          setForm((prev) => ({ ...prev, reporter: res.data[0].id }));
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      priority: PRIORITY_MAP[form.priority],
      status: STATUS_MAP[form.status],
      assignee: Number(form.assignee),
      reporter: Number(form.reporter),
    };

    try {
      const res = await API.post("/tickets", payload);
      console.log("Ticket created:", res.data);
      alert("Ticket created successfully!");
    } catch (err) {
      console.error("Error creating ticket:", err);
      alert("Failed to create ticket");
    }
  };

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
              {Object.entries(PRIORITY_MAP).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
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
              {Object.entries(STATUS_MAP).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
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
            <option value="">Select a user</option>
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

        <button className="btn btn-primary mt-2">Create Ticket</button>
      </form>
    </div>
  );
}