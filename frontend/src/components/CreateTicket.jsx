import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    reporter: "",
    assignee: "",
    priority: 1,
    status: "Open",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post("/tickets", form)
      .then(() => navigate("/tickets"))
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateTicket;