# Production Support Ticketing System

A full-stack web application for managing support tickets, inspired by enterprise systems like ServiceNow and Jira. This project demonstrates real-world CRUD operations, database integration, and frontend-backend communication.

## 🏗️ Architecture

```
Frontend (React) ↔️ Backend API (Flask) ↔️ Database (MySQL)
```

- **Frontend**: React with React Router, Axios, Chart.js
- **Backend**: Flask with CORS support
- **Database**: MySQL (production_support_db)

## 📁 Project Structure

```
ticketing-system/
├── backend/
│   ├── api.py                          # Flask application entry point
│   ├── requirements.txt                # Python dependencies
│   ├── .env.example                    # Environment variables template
│   └── app/
│       ├── __init__.py                 # Package initialization
│       ├── controllers/
│       │   ├── __init__.py
│       │   ├── ticket_controller.py   # Ticket business logic
│       │   └── user_controller.py     # User business logic
│       ├── repositories/
│       │   ├── __init__.py
│       │   ├── ticket_repository.py   # Ticket data access
│       │   └── user_repository.py     # User data access
│       ├── models/
│       │   ├── __init__.py
│       │   ├── ticket.py              # Ticket data model
│       │   └── user.py                # User data model
│       └── db/
│           ├── __init__.py
│           └── db.py                  # MySQL connection management
├── scripts/
│   ├── init_db.py                      # Database table initialization
│   └── create_sample_data.py           # Sample data creation
├── frontend/
│   ├── package.json                    # Node dependencies
│   ├── vite.config.js                  # Vite configuration
│   ├── eslint.config.js                # ESLint configuration
│   ├── index.html                      # HTML entry point
│   ├── src/
│   │   ├── main.jsx                    # React entry point
│   │   ├── App.jsx                     # App routing
│   │   ├── App.css                     # App styles
│   │   ├── index.css                   # Global styles
│   │   ├── api.js                      # Axios API client (port 5001)
│   │   ├── utils.js                    # Utility functions & constants
│   │   ├── components/
│   │   │   ├── Dashboard.jsx           # Main dashboard with KPIs
│   │   │   ├── TicketList.jsx          # List all tickets
│   │   │   ├── TicketDetails.jsx       # Single ticket view
│   │   │   ├── CreateTicket.jsx        # Create new ticket form
│   │   │   ├── EditTicket.jsx          # Edit ticket form
│   │   │   └── Navbar.jsx              # Navigation bar
│   │   ├── styles/
│   │   │   ├── Navbar.css
│   │   │   └── TicketList.css
│   │   └── assets/
│   └── public/
├── README.md                           # This documentation
├── .gitignore                          # Git ignore rules
└── .git/                               # Git repository
```

### Directory Roles

- **`backend/`**: Python Flask API server with layered architecture
  - `api.py`: Main Flask application
  - `app/controllers/`: Business logic layer
  - `app/repositories/`: Data access layer (Database operations)
  - `app/models/`: Data model definitions
  - `app/db/`: Database connection management
  - `requirements.txt`: Python dependencies

- **`scripts/`**: Utility scripts for setup and data management
  - `init_db.py`: Creates database tables
  - `create_sample_data.py`: Populates with sample data

- **`frontend/`**: React Vite application
  - Component-based UI with routing
  - Axios for API communication (connects to port 5001)
  - Centralized utility mappings and API configuration

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL Server
- Database: `production_support_db` (automatically created by `init_db.py`)

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure database**:
   ```bash
   export DB_HOST=localhost
   export DB_USER=root
   export DB_PASSWORD=your_password
   export DB_NAME=production_support_db
   ```
   You can copy the values from `backend/.env.example` into your shell or your local environment manager.

3. **Initialize database tables**:
   ```bash
   cd ../scripts
   python3 init_db.py
   ```

4. **[Optional] Create sample data**:
   ```bash
   python3 create_sample_data.py
   ```

5. **Start Flask server** (from backend directory):
   ```bash
   cd ../backend
   python3 api.py
   ```
   Server runs on `http://localhost:5001`

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Open application**:
   Visit `http://localhost:5173` in your browser

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(50)
);
```

### Tickets Table
```sql
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    status INT (1=Open, 2=In Progress, 3=Resolved),
    priority INT (1=Low, 2=Medium, 3=High),
    assigned_to INT,
    created_by INT,
    created_at TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

## 🔄 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/<id>` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/<id>` - Update user
- `DELETE /api/users/<id>` - Delete user

### Tickets
- `GET /api/tickets` - Get all tickets (with filtering)
- `GET /api/tickets/<id>` - Get ticket by ID
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/<id>` - Update ticket
- `DELETE /api/tickets/<id>` - Delete ticket

## 🎯 Features

### Core CRUD Operations
✅ Create tickets
✅ View all tickets (with search, filter, sort)
✅ View ticket details
✅ Update ticket (status, priority, assignee)
✅ Delete ticket

### Advanced Features
✅ Priority levels: Low (1), Medium (2), High (3)
✅ Status tracking: Open (1), In Progress (2), Resolved (3)
✅ Assign tickets to users
✅ Dashboard with KPIs (total, open, in progress, resolved)
✅ Charts (status breakdown, priority breakdown, 7-day activity)
✅ Search tickets by title, description, ID, assignee, reporter
✅ Filter by priority and status
✅ Sort by creation date

## 🛠️ Data Type Mapping

The system uses `numeric` status and priority values for consistency:

| Priority | Value |
|----------|-------|
| Low      | 1     |
| Medium   | 2     |
| High     | 3     |

| Status   | Value |
|----------|-------|
| Open     | 1     |
| In Progress | 2  |
| Resolved | 3     |

## 🔐 Security Improvements Needed

1. **Database Credentials**: Use environment variables (.env file)
   - Copy `backend/.env.example` to `backend/.env`
   - Update with your actual database credentials
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=production_support_db
   FLASK_ENV=development
   FLASK_DEBUG=True
   FLASK_PORT=5001
   ```

2. **Authentication**: Implement user login/JWT tokens
3. **Authorization**: Add role-based access control (RBAC)
4. **Input Validation**: Enhanced server-side validation
5. **Error Handling**: Better error messages and logging
6. **HTTPS**: Use HTTPS in production
7. **CORS**: Restrict CORS origins in production
8. **SQL Injection**: Use parameterized queries (currently implemented)

## 🔄 Data Flow

1. **Create Ticket**:
   - Frontend form (React) → API POST request
   - Backend validates input
   - Controller calls Repository
   - Repository executes INSERT SQL
   - Response sent back to frontend

2. **Fetch Tickets**:
   - TicketList component calls `API.get("/tickets")`
   - Flask route calls `ticket_controller.get_all()`
   - Controller calls `TicketRepository.get_all()`
   - Returns list of tickets from DB
   - Frontend maps data and displays in table

3. **Update Ticket**:
   - Edit form pre-filled with ticket data
   - Form submission sends PUT request with updated fields
   - Backend validates and executes UPDATE query
   - Redirects to ticket details page

## 🧪 Testing the Application

1. **Backend Test** (while Flask is running):
   ```bash
   # Get all tickets
   curl -X GET http://localhost:5001/api/tickets
   
   # Create a user
   curl -X POST http://localhost:5001/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com", "role": "support_engineer"}'
   
   # Create a ticket
   curl -X POST http://localhost:5001/api/tickets \
     -H "Content-Type: application/json" \
     -d '{"title": "Sample Ticket", "description": "Test description", "priority": 2, "status": 1, "assignee": 1, "reporter": 2}'
   ```

2. **Frontend Test**:
   - Open `http://localhost:5173` in browser
   - Navigate through Dashboard, Ticket List, Create Ticket
   - Test create, edit, delete operations
   - Verify filters and sorting work correctly

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development (Frontend + Backend + Database)
- RESTful API design
- Database operations (CRUD)
- React hooks (useState, useEffect)
- Axios HTTP client
- Flask routing and error handling
- CORS configuration
- Form handling and validation
- Real-world application architecture

## 📝 Environment Setup Checklist

- [ ] Install Python 3.8+
- [ ] Install Node.js 16+
- [ ] Install MySQL Server
- [ ] Create database: `production_support_db` (or run `scripts/init_db.py`)
- [ ] Navigate to `backend/` and install dependencies: `pip install -r requirements.txt`
- [ ] Configure database credentials in `backend/app/db/db.py` (optional—uses defaults)
- [ ] Navigate to `scripts/` and run `python3 init_db.py` to create tables
- [ ] [Optional] Run `python3 create_sample_data.py` to populate sample data
- [ ] Navigate to `backend/` and start Flask: `python3 api.py` (port 5001)
- [ ] Navigate to `frontend/` and install Node deps: `npm install`
- [ ] Start React dev server: `npm run dev` (port 5173)
- [ ] Test application at `http://localhost:5173`

## 🚧 Future Enhancements

- [ ] User authentication & JWT tokens
- [ ] Role-based access control (Admin, User, Viewer)
- [ ] Email notifications for ticket updates
- [ ] File attachments to tickets
- [ ] Ticket comments/activity history
- [ ] Real-time updates with WebSockets
- [ ] Advanced search with server-side filtering
- [ ] Pagination for large datasets
- [ ] Export tickets to CSV/PDF
- [ ] Mobile responsive design
- [ ] Dark mode
- [ ] Automated testing (Jest, Pytest)

## 📚 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [MySQL Connector Python](https://dev.mysql.com/doc/connector-python/en/)
- [Axios Documentation](https://axios-http.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is open source and available for educational purposes.
