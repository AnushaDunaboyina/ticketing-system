from app.repositories.ticket_repository import TicketRepository

repo = TicketRepository()

def create(assignee=None, reporter=None, title="", description="", priority=1, status=1):
    # Validate input
    if not (1 <= priority <= 3):
        raise ValueError("Priority must be between 1 and 3")
    if not (1 <= status <= 3):
        raise ValueError("Status must be between 1 and 3")
    if not title or not description:
        raise ValueError("Title and description are required")
    
    data = {
        "assignee": assignee,
        "reporter": reporter,
        "title": title,
        "description": description,
        "priority": priority,
        "status": status
    }
    repo.create(data)
    return {"message": "Ticket created successfully"}

def get(ticket_id):
    return repo.get_by_id(ticket_id)

def get_all():
    return repo.get_all()

def update(ticket_id, assignee=None, reporter=None, title=None, description=None, priority=None, status=None):
    ticket = get(ticket_id)
    if not ticket:
        raise ValueError(f"Ticket {ticket_id} not found")
    
    # Only update provided fields
    data = {
        "title": title if title is not None else ticket.get('title'),
        "description": description if description is not None else ticket.get('description'),
        "priority": priority if priority is not None else ticket.get('priority'),
        "status": status if status is not None else ticket.get('status'),
        "assignee": assignee if assignee is not None else ticket.get('assignee'),
        "reporter": reporter if reporter is not None else ticket.get('reporter')
    }
    
    # Validate
    if not (1 <= data["priority"] <= 3):
        raise ValueError("Priority must be between 1 and 3")
    if not (1 <= data["status"] <= 3):
        raise ValueError("Status must be between 1 and 3")
    
    repo.update(ticket_id, data)
    return {"message": "Ticket updated successfully"}

def delete(ticket_id):
    ticket = get(ticket_id)
    if not ticket:
        raise ValueError(f"Ticket {ticket_id} not found")
    repo.delete(ticket_id)
    return True
