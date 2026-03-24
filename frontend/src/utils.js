// Priority Mapping
export const PRIORITY_MAP = {
  1: "Low",
  2: "Medium",
  3: "High",
};

export const PRIORITY_OPTIONS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

// Status Mapping
export const STATUS_MAP = {
  1: "Open",
  2: "In Progress",
  3: "Resolved",
};

export const STATUS_OPTIONS = [
  { value: 1, label: "Open" },
  { value: 2, label: "In Progress" },
  { value: 3, label: "Resolved" },
];

// Get priority label from value
export const getPriorityLabel = (value) => {
  return PRIORITY_MAP[value] || "Unknown";
};

// Get status label from value
export const getStatusLabel = (value) => {
  return STATUS_MAP[value] || "Unknown";
};

// Get priority color for badge styling
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 1:
      return "info"; // Low - blue
    case 2:
      return "warning"; // Medium - yellow
    case 3:
      return "danger"; // High - red
    default:
      return "secondary";
  }
};

// Get status color for badge styling
export const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "danger"; // Open - red
    case 2:
      return "warning"; // In Progress - yellow
    case 3:
      return "success"; // Resolved - green
    default:
      return "secondary";
  }
};
