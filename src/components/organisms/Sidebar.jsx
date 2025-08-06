import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"

const DesktopSidebar = () => {
  const location = useLocation()
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "Briefcase" },
    { name: "Activities", href: "/activities", icon: "Activity" },
  ]
  
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
          <ApperIcon name="Zap" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">ClientFlow</h1>
          <p className="text-xs text-gray-500">CRM System</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive: linkActive }) => 
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  linkActive
                    ? "bg-gradient-primary text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              {({ isActive: linkActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    className={`mr-3 h-5 w-5 transition-colors ${
                      linkActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  {item.name}
                  {linkActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                      initial={false}
                    />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Sparkles" className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Need help?</p>
            <p className="text-xs text-gray-500">Contact support</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "Briefcase" },
    { name: "Activities", href: "/activities", icon: "Activity" },
  ]
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ApperIcon name="Zap" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">ClientFlow</h1>
              <p className="text-xs text-gray-500">CRM System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) => 
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-primary text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </>
  )
}

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar isOpen={isMobileOpen} onClose={onMobileClose} />
    </>
  )
}

export default Sidebar