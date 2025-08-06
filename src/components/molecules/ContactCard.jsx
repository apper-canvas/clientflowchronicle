import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatRelativeTime } from "@/utils/formatters"
import { motion } from "framer-motion"

const ContactCard = ({ contact, onClick, className = "" }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-primary-200 transition-all duration-200 ${className}`}
      onClick={() => onClick(contact)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gradient-primary text-white font-medium">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
            {contact.tags?.length > 0 && (
              <Badge variant="default" className="text-xs">
                {contact.tags[0]}
              </Badge>
            )}
          </div>
          
          <div className="space-y-1">
            {contact.company && (
              <p className="text-sm text-gray-600 truncate">{contact.company}</p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {contact.email && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="Mail" className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{contact.email}</span>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="Phone" className="h-3 w-3" />
                  <span>{contact.phone}</span>
                </div>
              )}
            </div>
            
            {contact.lastContactedAt && (
              <p className="text-xs text-gray-400">
                Last contacted: {formatRelativeTime(contact.lastContactedAt)}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-gray-400">
          <ApperIcon name="ChevronRight" className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  )
}

export default ContactCard