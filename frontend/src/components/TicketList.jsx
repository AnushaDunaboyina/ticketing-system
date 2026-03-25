import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/TicketList.css";
import "../styles/WorkspacePages.css";
import { PRIORITY_MAP, STATUS_MAP, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../utils";

const TicketList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const [ticketResponse, userResponse] = await Promise.all([
          API.get("/tickets"),
          API.get("/users"),
        ]);

        setTickets(Array.isArray(ticketResponse.data) ? ticketResponse.data : []);
        setUsers(Array.isArray(userResponse.data) ? userResponse.data : []);
        setError("");
      } catch (fetchError) {
        console.error("Error fetching tickets:", fetchError);
        setTickets([]);
        setUsers([]);
        setError("Unable to load tickets right now.");
      }
    }

    fetchTickets();
  }, []);

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

  const filteredTickets = tickets.filter((ticket) => {
    if (priorityFilter && ticket.priority !== priorityFilter) return false;
    if (statusFilter && ticket.status !== statusFilter) return false;

    const query = searchQuery.toLowerCase();

    const matchesSearch =
      ticket.id.toString().includes(query) ||
      (ticket.title || "").toLowerCase().includes(query) ||
      (ticket.description || "").toLowerCase().includes(query) ||
      getUserName(ticket.assignee).toLowerCase().includes(query) ||
      getUserName(ticket.reporter).toLowerCase().includes(query) ||
      (ticket.assignee && ticket.assignee.toString().toLowerCase().includes(query)) ||
      (ticket.reporter && ticket.reporter.toString().toLowerCase().includes(query));

    return matchesSearch;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortKey === "created_at") {
      return sortOrder === "desc"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    }

    if (sortKey === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }

    return 0;
  });

  const totalTickets = tickets.length;
  const resolvedCount = tickets.filter((ticket) => ticket.status === 3).length;
  const highPriorityCount = tickets.filter((ticket) => ticket.priority === 3).length;
  const activeFilterCount = [priorityFilter, statusFilter, searchQuery, sortKey].filter(Boolean).length;

  const getPriorityClass = (priority) => {
    if (priority === 3) return "priority-high";
    if (priority === 2) return "priority-medium";
    return "priority-low";
  };

  const getStatusClass = (status) => {
    if (status === 3) return "status-resolved";
    if (status === 2) return "status-progress";
    return "status-open";
  };

  return (
    <div className="ticket-board-shell">
      <section className="ticket-board-hero">
        <div className="ticket-board-copy">
          <span className="ticket-board-eyebrow">Ticket Workspace</span>
          <h1 className="ticket-board-title">Keep the queue clear, visible, and ready for action.</h1>
          <p>
            Search across ticket details, scan who owns what, and jump into the
            highest-pressure issues without digging through noisy tables.
          </p>

          <div className="ticket-board-actions">
            <Link to="/create" className="ticket-board-primary">
              Create Ticket
            </Link>
            <Link to="/users" className="ticket-board-secondary">
              Manage Users
            </Link>
          </div>

          <div className="ticket-filter-chips">
            <span className="ticket-filter-chip">
              Visible <strong>{sortedTickets.length}</strong>
            </span>
            <span className="ticket-filter-chip">
              Filters <strong>{activeFilterCount}</strong>
            </span>
            <span className="ticket-filter-chip">
              Team <strong>{users.length}</strong>
            </span>
          </div>
        </div>

        <aside className="ticket-board-panel">
          <span className="ticket-board-panel-label">Queue Snapshot</span>
          <strong className="ticket-board-panel-value">{totalTickets}</strong>
          <p>Total tickets currently tracked in the workspace.</p>

          <div className="ticket-board-panel-stats">
            <div>
              <span>High priority</span>
              <strong>{highPriorityCount}</strong>
            </div>
            <div>
              <span>Resolved</span>
              <strong>{resolvedCount}</strong>
            </div>
            <div>
              <span>Still active</span>
              <strong>{totalTickets - resolvedCount}</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="ticket-table-shell">
        <div className="ticket-table-toolbar">
          <div className="ticket-search-wrap">
            <input
              type="text"
              className="form-control ticket-search-input"
              placeholder="Search by ID, title, description, assignee, or reporter"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <small className="search-helper-text">
              Searchable fields: ticket ID, title, description, assignee, reporter
            </small>
          </div>

          <div className="ticket-toolbar-actions">
            <button className="ticket-clear-btn" onClick={clearAllFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {error ? <div className="workspace-alert">{error}</div> : null}

        <div className="ticket-table-scroll">
          <table className="table ticket-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ticket</th>
                <th className={priorityFilter ? "sort-active" : ""}>
                  <div className="dropdown">
                    <span className="dropdown-toggle header-filter" data-bs-toggle="dropdown">
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
                        <button className="dropdown-item" onClick={() => setPriorityFilter(null)}>
                          All Priorities
                        </button>
                      </li>
                    </ul>
                  </div>
                </th>
                <th className={statusFilter ? "sort-active" : ""}>
                  <div className="dropdown">
                    <span className="dropdown-toggle header-filter" data-bs-toggle="dropdown">
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
                        <button className="dropdown-item" onClick={() => setStatusFilter(null)}>
                          All Statuses
                        </button>
                      </li>
                    </ul>
                  </div>
                </th>
                <th>Assignee</th>
                <th>Reporter</th>
                <th className={sortKey === "created_at" ? "sort-active" : ""}>
                  <div className="dropdown">
                    <span className="dropdown-toggle header-filter" data-bs-toggle="dropdown">
                      Created <span className="sort-icon">⮟</span>
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
                <th>Summary</th>
              </tr>
            </thead>

            <tbody>
              {sortedTickets.length === 0 ? (
                <tr className="ticket-empty-row">
                  <td colSpan="7">No tickets match the current view.</td>
                </tr>
              ) : (
                sortedTickets.map((ticket) => (
                  <tr key={ticket.id} onClick={() => navigate(`/ticket/${ticket.id}`)}>
                    <td>
                      <span className="ticket-id-pill">#{ticket.id}</span>
                    </td>
                    <td>
                      <div className="ticket-title-cell">
                        <span className="ticket-title-text">{ticket.title}</span>
                        <span className="ticket-title-meta">Open the ticket for full details and actions</span>
                      </div>
                    </td>
                    <td>
                      <span className={`ticket-badge ${getPriorityClass(ticket.priority)}`}>
                        {PRIORITY_MAP[ticket.priority] || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <span className={`ticket-badge ticket-status-badge ${getStatusClass(ticket.status)}`}>
                        {STATUS_MAP[ticket.status] || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <div className="ticket-name-cell">
                        <span className="ticket-name-label">{getUserName(ticket.assignee)}</span>
                        <span className="ticket-name-meta">Current owner</span>
                      </div>
                    </td>
                    <td>
                      <div className="ticket-name-cell">
                        <span className="ticket-name-label">{getUserName(ticket.reporter)}</span>
                        <span className="ticket-name-meta">Requested by</span>
                      </div>
                    </td>
                    <td>
                      <div className="ticket-created-meta">
                        <span className="ticket-created-date">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                        <span className="ticket-created-time">
                          {new Date(ticket.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="ticket-summary">{ticket.description || "No description provided."}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TicketList;
