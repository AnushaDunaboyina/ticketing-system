from models.ticket import Ticket

tickets = []

def create(assignee=None, reporter=None, title="", description="", priority=1, status=1):
    ticket = Ticket(assignee=assignee, reporter=reporter, title=title, description=description, priority=priority, status=status)
    tickets.append(ticket)
    return ticket

def get(ticket_id):
    for ticket in tickets:
        if ticket.id == ticket_id:
            return ticket
    return None

def get_all():
    return tickets.copy()

def update(ticket_id, assignee=None, reporter=None, title=None, description=None, priority=None, status=None):
    ticket = get(ticket_id)
    if ticket:
        if assignee is not None:
            ticket.assignee = assignee
        if reporter is not None:
            ticket.reporter = reporter
        if title is not None:
            ticket.title = title
        if description is not None:
            ticket.description = description
        if priority is not None:
            ticket.priority = priority
        if status is not None:
            ticket.status = status

        if not (1 <= ticket.priority <= 4):
            raise ValueError("Priority must be between 1 and 4")
        if ticket.status not in ["Open", "In Progress", "Complete"]:
            raise ValueError("Status must be one of: Open, In Progress, Complete")
        return ticket

    return None

def delete(ticket_id):
    ticket = get(ticket_id)
    if ticket:
        tickets.remove(ticket)
        return True
    return False
