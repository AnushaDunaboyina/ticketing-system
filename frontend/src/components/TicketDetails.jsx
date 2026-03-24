import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const PRIORITY_LABELS = { 1: "Low", 2: "Medium", 3: "High" };
const STATUS_LABELS = { 1: "Open", 2: "In Progress", 3: "Resolved" };

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ticket + users
  useEffect(() => {
    async function fetchData() {
      try {
        const [ticketRes, usersRes] = await Promise.all([
          API.get(`/tickets/${id}`),
          API.get("/users"),
        ]);

        setTicket(ticketRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error loading ticket:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!ticket) return <div className="container mt-4">Ticket not found</div>;

  // Convert user IDs → names
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : `User ${userId}`;
  };

  // Delete the current ticket
  const handleDelete = async () => {
    
    // Ask user for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    
    try {
      // Send DELETE request request to backend
      await API.delete(`/tickets/${ticket.id}`);
      alert("Ticket deleted successfully");

      // Redirect back to ticket list
      navigate("/tickets");
    } catch (err) {
      console.error("Error deleting ticket:", err);

      // Show error message
      alert("Failed to delete ticket");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Ticket #{ticket.id}</h2>

      <div className="card p-4 shadow-sm">
        <h4>{ticket.title}</h4>
        <p className="text-muted">{ticket.description}</p>

        <hr />

        <div className="row">
          <div className="col-md-6 mb-3">
            <strong>Priority:</strong> {PRIORITY_LABELS[ticket.priority]}
          </div>

          <div className="col-md-6 mb-3">
            <strong>Status:</strong> {STATUS_LABELS[ticket.status]}
          </div>

          <div className="col-md-6 mb-3">
            <strong>Assignee:</strong> {getUserName(ticket.assignee)}
          </div>

          <div className="col-md-6 mb-3">
            <strong>Reporter:</strong> {getUserName(ticket.reporter)}
          </div>

          <div className="col-md-6 mb-3">
            <strong>Created At:</strong>{" "}
            {new Date(ticket.created_at).toLocaleString()}
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
          >
            Edit Ticket
          </button>

          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
            </button>
        </div>
      </div>
    </div>
  );
}