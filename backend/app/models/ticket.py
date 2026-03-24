from datetime import datetime

PRIORITY_MAP = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
}

STATUS_MAP = {
    1: 'Open',
    2: 'In Progress',
    3: 'Resolved',
}


class Ticket:
    _id_counter = 1

    def __init__(self, assignee=0, reporter=0, title="", description="", priority=1, status=1):
        self.id = Ticket._id_counter
        Ticket._id_counter += 1
        self.assignee = assignee
        self.reporter = reporter
        self.time_stamp = datetime.now()
        self.title = title
        self.description = description
        self.priority = priority
        self.status = status

        if not (1 <= self.priority <= 3):
            raise ValueError("Priority must be between 1 and 3")
        if self.status not in STATUS_MAP:
            raise ValueError("Status must be between 1 and 3")

    @property
    def priority_label(self):
        return PRIORITY_MAP.get(self.priority, 'Unknown')

    @property
    def status_label(self):
        return STATUS_MAP.get(self.status, 'Unknown')
