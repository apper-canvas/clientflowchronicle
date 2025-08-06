import { format, formatDistance, isToday, isYesterday, parseISO } from "date-fns"

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "MMM dd, yyyy")
}

export const formatTime = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, "h:mm a")
}

export const formatRelativeTime = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? parseISO(date) : date
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, "h:mm a")}`
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, "h:mm a")}`
  }
  
  return formatDistance(dateObj, new Date(), { addSuffix: true })
}

export const formatPercentage = (value) => {
  return `${Math.round(value)}%`
}

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}