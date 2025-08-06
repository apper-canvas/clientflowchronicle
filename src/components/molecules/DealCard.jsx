import { Avatar, AvatarFallback } from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency, formatDate } from "@/utils/formatters"
import { getStageColor } from "@/utils/dealStages"
import { motion } from "framer-motion"

const DealCard = ({ deal, contact, onEdit, onDelete, isDragging = false }) => {
  const stageInfo = getStageColor(deal.stage)
  
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? "opacity-50 rotate-2 scale-105" : ""
      }`}
    >
      {/* Deal Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
<h3 className="font-semibold text-gray-900 truncate mb-1">{deal.title_c || deal.title || deal.Name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold gradient-text">
{formatCurrency(deal.value_c || deal.value)}
            </span>
            <Badge className={`text-xs ${stageInfo.color} text-white`}>
{deal.probability_c || deal.probability}%
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(deal)
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <ApperIcon name="Edit3" className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(deal.Id)
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Contact Info */}
      {contact && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-secondary text-white text-xs">
{getInitials(contact.Name || contact.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
<p className="text-sm font-medium text-gray-900 truncate">{contact.Name || contact.name}</p>
            {contact.company && (
<p className="text-xs text-gray-500 truncate">{contact.company_c || contact.company}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Deal Details */}
      <div className="space-y-2">
{(deal.expectedCloseDate_c || deal.expectedCloseDate) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Calendar" className="h-4 w-4" />
            <span>Close: {formatDate(deal.expectedCloseDate_c || deal.expectedCloseDate)}</span>
          </div>
        )}
        
{(deal.notes_c || deal.notes) && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <ApperIcon name="FileText" className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2 text-xs">{deal.notes_c || deal.notes}</p>
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
<span>{deal.probability_c || deal.probability}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${stageInfo.gradient} transition-all duration-300`}
style={{ width: `${deal.probability_c || deal.probability}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default DealCard