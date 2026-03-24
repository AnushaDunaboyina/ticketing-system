import "../styles/Navbar.css";

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-3">
      <NavLink className="navbar-brand" to="/">
        ResolveHub
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/tickets">
              Tickets
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/create">
              New Ticket
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/users">
              Users
            </NavLink>
          </li>


        </ul>
      </div>
    </nav>
  );
}