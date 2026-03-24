import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../api";


// Chart.js imports
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [activity, setActivity] = useState([]);

  // Simulated logged-in user (replace with real auth later)
  const loggedInUser = "Vikas";

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = API.get("/tickets");
      const allTickets = res.data;

      setTickets(allTickets);

      // Tickets assigned to logged-in user
      const mine = allTickets.filter(
        (t) => t.assignee?.toLowerCase() === loggedInUser.toLowerCase()
      );
      setMyTickets(mine);

      // Recent activity feed
      const activityFeed = allTickets
        .map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          updated_at: t.updated_at || t.created_at,
        }))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 5);

      setActivity(activityFeed);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  // KPI Calculations
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "Open").length;
  const inProgress = tickets.filter((t) => t.status === "In Progress").length;
  const closed = tickets.filter((t) => t.status === "Closed").length;

  const high = tickets.filter((t) => t.priority === "High").length;
  const medium = tickets.filter((t) => t.priority === "Medium").length;
  const low = tickets.filter((t) => t.priority === "Low").length;


  // Compute tickets created in the last 7 days
const [last7DaysData, setLast7DaysData] = useState([]);

useEffect(() => {
  if (tickets.length > 0) {
    calculateLast7Days();
  }
}, [tickets]);

const calculateLast7Days = () => {
  const today = new Date();
  const daysArray = [];

  // Create an array for the last 7 days
  for (let i = 6; i >= 0; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    daysArray.push({
      date: d.toISOString().split("T")[0], // YYYY-MM-DD
      count: 0,
    });
  }

  // Count tickets created on each day
  tickets.forEach((ticket) => {
    const createdDate = ticket.created_at?.split("T")[0];
    const day = daysArray.find((d) => d.date === createdDate);
    if (day) day.count += 1;
  });

  setLast7DaysData(daysArray);
};

  return (
    <div className="container-fluid px-4">
      <h2 className="mb-4"> </h2>

      {/* KPI CARDS */}
      <div className="row mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Total Tickets</h5>
              <h2>{total}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Open</h5>
              <h2>{open}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>In Progress</h5>
              <h2>{inProgress}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>Closed</h5>
              <h2>{closed}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row mb-4">
        {/* STATUS PIE CHART */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Status Breakdown</h5>

              <Pie
                data={{
                  labels: ["Open", "In Progress", "Closed"],
                  datasets: [
                    {
                      data: [open, inProgress, closed],
                      backgroundColor: ["#007bff", "#ffc107", "#28a745"],
                    },
                  ],
                }}
              />
            </div>
            <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>Current distribution of all tickets</p>

          </div>
        </div>

        {/* PRIORITY BAR CHART */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Priority Breakdown</h5>

              <Bar
                data={{
                  labels: ["High", "Medium", "Low"],
                  datasets: [
                    {
                      label: "Tickets",
                      data: [high, medium, low],
                      backgroundColor: ["#dc3545", "#ffc107", "#17a2b8"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
            <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>Current distribution of all tickets</p>
          </div>
        </div>
      </div>

      {/* TICKETS CREATED IN LAST 7 DAYS */}
      <div className="col-md-12 mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5>Tickets Created in Last 7 Days</h5>

            <Bar
              data={{
                labels: last7DaysData.map((d) =>
                  new Date(d.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })
                ),
                datasets: [
                  {
                    label: "Tickets",
                    data: last7DaysData.map((d) => d.count),
                    backgroundColor: "#007bff",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* MY TICKETS + RECENT ACTIVITY */}
      <div className="row">
        {/* My Tickets */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5>My Tickets</h5>

              {myTickets.length === 0 ? (
                <p className="text-muted">No tickets assigned to you.</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTickets.map((t) => (
                      <tr key={t.id}>
                        <td>{t.title}</td>
                        <td>{t.status}</td>
                        <td>{t.priority}</td>
                        <td>
                          <Link
                            to={`/ticket/${t.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Recent Activity</h5>

              <ul className="list-group">
                {activity.map((a) => (
                  <li key={a.id} className="list-group-item">
                    <strong>{a.title}</strong>
                    <br />
                    Status: {a.status}
                    <br />
                    <small className="text-muted">
                      Updated: {new Date(a.updated_at).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;