import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import TicketList from "./components/TicketList.jsx";
import CreateTicket from "./components/CreateTicket.jsx";
import EditTicket from "./components/EditTicket.jsx";
import TicketDetails from "./components/TicketDetails.jsx";
import Navbar from "./components/Navbar.jsx";

console.log("App loaded");

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/ticket/:id" element={<TicketDetails />} />
        <Route path="/create" element={<CreateTicket />} />
        <Route path="/tickets/:id/edit" element={<EditTicket />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;