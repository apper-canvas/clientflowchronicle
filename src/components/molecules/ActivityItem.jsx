import { Avatar, AvatarFallback } from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatRelativeTime, formatDuration } from "@/utils/formatters"
import { getActivityType } from "@/utils/dealStages"
import { motion } from "framer-motion"

const ActivityItem = ({ activity, contact, deal, className = "" }) => {
const activityType = getActivityType(activity.type_c || activity.type)
  
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-start gap-4">
        {/* Activity Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activityType.bgColor} flex items-center justify-center`}>
          <ApperIcon name={activityType.icon} className={`h-5 w-5 ${activityType.color}`} />
        </div>
        
        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {activityType.name}
              </Badge>
              <span className="text-sm text-gray-500">
{formatRelativeTime(activity.date_c || activity.date)}
              </span>
{(activity.duration_c || activity.duration) && (
                <span className="text-sm text-gray-400">
                  • {formatDuration(activity.duration_c || activity.duration)}
                </span>
              )}
            </div>
          </div>
          
<p className="text-gray-900 mb-3">{activity.description_c || activity.description}</p>
          
          {/* Related Contact/Deal */}
          <div className="flex items-center gap-4">
            {contact && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gradient-primary text-white text-xs">
{getInitials(contact.Name || contact.name)}
                  </AvatarFallback>
                </Avatar>
<span className="text-sm text-gray-600">{contact.Name || contact.name}</span>
              </div>
            )}
            
            {deal && (
              <div className="flex items-center gap-2">
                <ApperIcon name="Briefcase" className="h-4 w-4 text-gray-400" />
<span className="text-sm text-gray-600">{deal.title_c || deal.title || deal.Name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ActivityItem