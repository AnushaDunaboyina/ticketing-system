import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/TicketList.css";
import { useNavigate } from "react-router-dom";
import { PRIORITY_MAP, STATUS_MAP, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../utils";

const TicketList = () => {

  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  
  // FILTER STATES
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // SORT STATES
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first
  
  async function fetchTickets() {
    try {
      const [ticketResponse, userResponse] = await Promise.all([
        API.get("/tickets"),
        API.get("/users"),
      ]);
      setTickets(Array.isArray(ticketResponse.data) ? ticketResponse.data : []);
      setUsers(Array.isArray(userResponse.data) ? userResponse.data : []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
      setUsers([]);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  // GLOBAL CLEAR FILTERS BUTTON
  const clearAllFilters = () => {
    setPriorityFilter(null);
    setStatusFilter(null);
    setSearchQuery("");
    setSortKey(null);
    setSortOrder("desc");
  };

  const getUserName = (userId) => {
    const user = users.find((entry) => entry.id === userId);
    return user ? user.name : `User ${userId}`;
  };


  // 1️. FILTERING LOGIC (priority, status, search)
  const filteredTickets = tickets.filter((ticket) => {

    // PRIORITY FILTER
    if (priorityFilter && ticket.priority !== priorityFilter) return false;

    // STATUS FILTER
    if (statusFilter && ticket.status !== statusFilter) return false;

    // SEARCH FILTER (ID, title, description, assignee, reporter)
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      ticket.id.toString().includes(q) || // search by ID
      (ticket.title || "").toLowerCase().includes(q) || // search by title
      (ticket.description || "").toLowerCase().includes(q) || // search by description
      getUserName(ticket.assignee).toLowerCase().includes(q) || // search by assignee name
      getUserName(ticket.reporter).toLowerCase().includes(q) || // search by reporter name
      (ticket.assignee && ticket.assignee.toString().toLowerCase().includes(q)) || // search by assignee
      (ticket.reporter && ticket.reporter.toString().toLowerCase().includes(q)); // search by reporter

    if (!matchesSearch) return false;

    return true; // keep ticket
  });

  // 2. SORTING LOGIC
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    // Sort by created_at
    if (sortKey === "created_at") {
      return sortOrder === "desc"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    }

    // Sort by ID
    if (sortKey === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }

    return 0;
  });
  
  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Tickets</h2>

      {/* SEARCH + CLEAR FILTERS */}
      <div className="d-flex justify-content-between align-items-start mb-3">

        {/* LEFT SIDE: Search + helper text */}
        <div className="w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <small className="search-helper-text">
            Searchable fields: ID, title, description, assignee, reporter
          </small>
        </div>

        {/* RIGHT SIDE: Clear button */}
        <button className="btn btn-light ms-3" onClick={clearAllFilters}>
          Clear All Filters
        </button>

      </div>

      {/* TABLE */}
      <table className="table table-bordered table-hover mt-3">
        <thead>
          <tr>
            {/* ID */}
            <th>ID</th>

            {/* TITLE */}
            <th>Title</th>

            {/* PRIORITY FILTER */}
            <th className={priorityFilter ? "sort-active" : ""}>
              <div className="dropdown">
                <span
                  className="dropdown-toggle header-filter"
                  data-bs-toggle="dropdown"
                >
                  Priority <span className="sort-icon">⮟</span>
                </span>

                <ul className="dropdown-menu">
                  {PRIORITY_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <button
                        className="dropdown-item"
                        onClick={() => setPriorityFilter(option.value)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setPriorityFilter(null)}
                    >
                      All Priorities
                    </button>
                  </li>
                </ul>
              </div>
            </th>

            {/* STATUS FILTER */}
            <th className={statusFilter ? "sort-active" : ""}>
              <div className="dropdown">
                <span
                  className="dropdown-toggle header-filter"
                  data-bs-toggle="dropdown"
                >
                  Status <span className="sort-icon">⮟</span>
                </span>

                <ul className="dropdown-menu">
                  {STATUS_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <button
                        className="dropdown-item"
                        onClick={() => setStatusFilter(option.value)}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setStatusFilter(null)}
                    >
                      All Statuses
                    </button>
                  </li>
                </ul>
              </div>
            </th>

            {/* ASSIGNEE */}
            <th>Assignee</th>

            {/* REPORTER */}
            <th>Reporter</th>

            {/* CREATED AT SORT */}
            <th className={sortKey === "created_at" ? "sort-active" : ""}>
              <div className="dropdown">
                <span
                  className="dropdown-toggle header-filter"
                  data-bs-toggle="dropdown"
                >
                  Created At <span className="sort-icon">⮟</span>
                </span>

                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setSortKey("created_at");
                        setSortOrder("desc");
                      }}
                    >
                      Latest
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setSortKey("created_at");
                        setSortOrder("asc");
                      }}
                    >
                      Oldest
                    </button>
                  </li>
                </ul>
              </div>
            </th>

            {/* DESCRIPTION */}
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {sortedTickets.map((ticket) => (
            <tr key={ticket.id}
            onClick={() => navigate(`/ticket/${ticket.id}`)}
            >
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td><span
                  className={
                    ticket.priority === 3
                      ? "priority-high"
                      : ticket.priority === 2
                      ? "priority-medium"
                      : "priority-low"
                  }
                >
                  {PRIORITY_MAP[ticket.priority] || "Unknown"}
                </span>
              </td>
              <td>{STATUS_MAP[ticket.status] || "Unknown"}</td>
              <td>{getUserName(ticket.assignee)}</td>
              <td>{getUserName(ticket.reporter)}</td>
              <td>{new Date(ticket.created_at).toLocaleString()}</td>
              <td>{ticket.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

};

export default TicketList;
