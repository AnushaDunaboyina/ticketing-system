import { useEffect, useState } from "react";
import API from "../api";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/tickets")
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div>
      <h2>Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            {ticket.title} — {ticket.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;