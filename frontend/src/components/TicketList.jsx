import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TicketList.css";
import { useNavigate } from "react-router-dom";
import API from "../api";


const TicketList = () => {

  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  
  // FILTER STATES
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // SORT STATES
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first
  

  useEffect(() => {
    fetchTickets();
  }, []);

  //Fetch all tickets from backend
  const fetchTickets = async () => {
    try {
      const response = await API.get("/tickets");
      setTickets(response.data);
      console.log("One ticket:", response.data[0]);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([
      {
        id: 1,
        title: "Login issue",
        description: "User cannot log in",
        priority: "High",
        status: "Open",
        assignee: "Anusha",
        reporter: "Sarah",
        created_at: "2024-01-10T10:20:00Z"
      },
      {
        id: 2,
        title: "UI bug",
        description: "Button misaligned",
        priority: "Low",
        status: "Closed",
        assignee: "Gregory",
        reporter: "John",
        created_at: "2024-01-10T10:30:00Z"

      },
      {
        id: 3,
        title: "Payment failure",
        description: "Payment gateway returns 500 error",
        priority: "Medium",
        status: "In Progress",
        assignee: "Joshua",
        reporter: "Micheal",
        created_at: "2024-01-11T14:20:00Z"
      },
      {
        id: 4,
        title: "Login failure",
        description: "Authentication error 404",
        priority: "Medium",
        status: "Open",
        assignee: "Neil",
        reporter: "James",
        created_at: "2024-01-12T09:15:00Z"
      }
      
    ]);

    }
  };

  // GLOBAL CLEAR FILTERS BUTTON
  const clearAllFilters = () => {
    setPriorityFilter(null);
    setStatusFilter(null);
    setSearchQuery("");
    setSortKey(null);
    setSortOrder("desc");
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
      ticket.title.toLowerCase().includes(q) || // search by title
      ticket.description.toLowerCase().includes(q) || // search by description
      ticket.assignee.toString.toLowerCase().includes(q) || // search by assignee
      ticket.reporter.toString.toLowerCase().includes(q); // search by reporter

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
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setPriorityFilter("Low")}
                    >
                      Low
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setPriorityFilter("Medium")}
                    >
                      Medium
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setPriorityFilter("High")}
                    >
                      High
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
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setStatusFilter("Open")}
                    >
                      Open
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setStatusFilter("In Progress")}
                    >
                      In Progress
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setStatusFilter("Resolved")}
                    >
                      Resolved
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
                    ticket.priority === "High"
                      ? "priority-high"
                      : ticket.priority === "Medium"
                      ? "priority-medium"
                      : "priority-low"
                  }
                >
                  {ticket.priority}
                </span>
              </td>
              <td>{ticket.status}</td>
              <td
                style={{ cursor: "pointer", color: "blue" }}
                onClick={(e) => {
                  e.stopPropagation(); // prevent row click
                  navigate(`/users/${ticket.assignee}`);
                }}
              >
                {ticket.assignee}
              </td>              <td>{ticket.reporter}</td>
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