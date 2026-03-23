import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    API.get(`/tickets/${id}`).then((res) => setForm(res.data));
  }, [id]);

  if (!form) return <p>Loading...</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    API.put(`/tickets/${id}`, form)
      .then(() => navigate("/tickets"))
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default EditTicket;