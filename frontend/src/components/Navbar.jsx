import "../styles/Navbar.css";

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-3">
      <NavLink className="navbar-brand" to="/">
        <span className="navbar-brand-badge">
          <img
            src="/resolvehub-icon.png"
            alt="ResolveHub icon"
            className="navbar-brand-logo"
          />
        </span>
        <span className="navbar-brand-copy">
          <span className="navbar-brand-name">ResolveHub</span>
          <span className="navbar-brand-tagline">From Incident to Insight</span>
        </span>
      </NavLink>

      <button
        className="navbar-toggler custom-navbar-toggler"
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
