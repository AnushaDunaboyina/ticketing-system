import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import TicketList from "./components/TicketList.jsx";
import CreateTicket from "./components/CreateTicket.jsx";
import EditTicket from "./components/EditTicket.jsx";
import TicketDetails from "./components/TicketDetails.jsx";
console.log("App loaded");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/create" element={<CreateTicket />} />
        <Route path="/edit/:id" element={<EditTicket />} />
        <Route path="/ticket/:id" element={<TicketDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;