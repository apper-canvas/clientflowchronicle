import { useState } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ title, onMobileMenuToggle, children }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </button>
          
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your customer relationships and track opportunities
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          {children}
        </div>
      </div>
    </header>
  )
}

export default Header