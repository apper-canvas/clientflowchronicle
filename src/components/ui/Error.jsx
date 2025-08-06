import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <ApperIcon name="RotateCcw" className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error