import { useEffect, useState } from "react";
import API from "../api";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../utils";

export default function CreateTicket() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setUsers(res.data);

        // Auto-fill reporter with first user
        if (res.data.length > 0) {
          setForm((prev) => ({ 
            ...prev, 
            reporter: res.data[0].id,
            assignee: res.data[0].id 
          }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
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
    try {
      console.log("Submitting ticket:", form);
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