import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  children, 
  variant = "default", 
  size = "default", 
  className, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    default: "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
    secondary: "bg-gradient-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
    outline: "border-2 border-primary-200 text-primary-600 hover:border-primary-300 hover:bg-primary-50 hover:scale-105",
    ghost: "text-gray-600 hover:text-primary-600 hover:bg-primary-50 hover:scale-105",
    danger: "bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl hover:scale-105 active:scale-95"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button