export const DEAL_STAGES = {
  LEAD: {
    id: "lead",
    name: "Lead",
    color: "bg-gray-500",
    gradient: "from-gray-400 to-gray-600",
    order: 1
  },
  QUALIFIED: {
    id: "qualified",
    name: "Qualified",
    color: "bg-blue-500",
    gradient: "from-blue-400 to-blue-600",
    order: 2
  },
  PROPOSAL: {
    id: "proposal",
    name: "Proposal",
    color: "bg-yellow-500",
    gradient: "from-yellow-400 to-yellow-600",
    order: 3
  },
  NEGOTIATION: {
    id: "negotiation",
    name: "Negotiation",
    color: "bg-orange-500",
    gradient: "from-orange-400 to-orange-600",
    order: 4
  },
  CLOSED: {
    id: "closed",
    name: "Closed",
    color: "bg-green-500",
    gradient: "from-green-400 to-green-600",
    order: 5
  }
}

export const ACTIVITY_TYPES = {
  CALL: {
    id: "call",
    name: "Call",
    icon: "Phone",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  EMAIL: {
    id: "email",
    name: "Email",
    icon: "Mail",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  MEETING: {
    id: "meeting",
    name: "Meeting",
    icon: "Calendar",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  TASK: {
    id: "task",
    name: "Task",
    icon: "CheckSquare",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  NOTE: {
    id: "note",
    name: "Note",
    icon: "FileText",
    color: "text-gray-600",
    bgColor: "bg-gray-100"
  }
}

export const getStageColor = (stageId) => {
  return DEAL_STAGES[stageId?.toUpperCase()] || DEAL_STAGES.LEAD
}

export const getActivityType = (typeId) => {
  return ACTIVITY_TYPES[typeId?.toUpperCase()] || ACTIVITY_TYPES.NOTE
}