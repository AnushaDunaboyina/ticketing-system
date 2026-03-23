import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    API.get(`/tickets/${id}`)
      .then((res) => setTicket(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!ticket) return <p>Loading...</p>;

  return (
    <div>
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
    </div>
  );
}

export default TicketDetails;