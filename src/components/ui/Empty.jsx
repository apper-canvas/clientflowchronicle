import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item",
  actionLabel = "Add New",
  onAction,
  icon = "Plus",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-primary-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} size="lg" className="gap-2">
          <ApperIcon name={icon} className="h-5 w-5" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty