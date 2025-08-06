import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"
import { ACTIVITY_TYPES } from "@/utils/dealStages"

const ActivityModal = ({ isOpen, onClose, activity, contacts, deals, onSave }) => {
  const [formData, setFormData] = useState({
    type: "call",
    contactId: "",
    dealId: "",
    description: "",
    date: "",
    duration: ""
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (activity) {
      const activityDate = new Date(activity.date)
      const dateString = activityDate.toISOString().slice(0, 16)
      
setFormData({
        type: activity.type_c || activity.type || "call",
        contactId: (activity.contactId_c || activity.contactId) || "",
        dealId: (activity.dealId_c || activity.dealId) || "",
        description: activity.description_c || activity.description || "",
        date: dateString,
        duration: (activity.duration_c || activity.duration)?.toString() || ""
      })
    } else {
      const now = new Date()
      const dateString = now.toISOString().slice(0, 16)
      
      setFormData({
        type: "call",
        contactId: "",
        dealId: "",
        description: "",
        date: dateString,
        duration: ""
      })
    }
    setErrors({})
  }, [activity, isOpen])
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.description.trim()) {
      newErrors.description = "Activity description is required"
    }
    
    if (!formData.date) {
      newErrors.date = "Date and time is required"
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact"
    }
    
    if (formData.duration && (isNaN(parseInt(formData.duration)) || parseInt(formData.duration) <= 0)) {
      newErrors.duration = "Duration must be a positive number"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const activityData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      duration: formData.duration ? parseInt(formData.duration) : null,
      dealId: formData.dealId || null
    }
    
// Transform to database field names
    const finalData = {
      type_c: activityData.type,
      contactId_c: activityData.contactId ? parseInt(activityData.contactId) : null,
      dealId_c: activityData.dealId ? parseInt(activityData.dealId) : null,
      description_c: activityData.description,
      date_c: activityData.date,
      duration_c: activityData.duration ? parseInt(activityData.duration) : null
    }
    
    if (activity) {
      finalData.Id = activity.Id
    }
    
    // Pass the transformed data to the service
    onSave(finalData)
    
    onSave(activityData)
    onClose()
  }
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {activity ? "Edit Activity" : "Log New Activity"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Activity Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  >
                    {Object.values(ACTIVITY_TYPES).map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    placeholder="30"
                    min="1"
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-600 mt-1">{errors.duration}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label>Contact *</Label>
                <select
                  value={formData.contactId}
                  onChange={(e) => handleChange("contactId", e.target.value)}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  <option value="">Select a contact</option>
                  {contacts.map((contact) => (
<option key={contact.Id} value={contact.Id}>
                      {contact.Name || contact.name} {(contact.company_c || contact.company) && `- ${contact.company_c || contact.company}`}
                    </option>
                  ))}
                </select>
                {errors.contactId && (
                  <p className="text-sm text-red-600 mt-1">{errors.contactId}</p>
                )}
              </div>
              
              <div>
                <Label>Related Deal</Label>
                <select
                  value={formData.dealId}
                  onChange={(e) => handleChange("dealId", e.target.value)}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  <option value="">No related deal</option>
                  {deals.map((deal) => (
<option key={deal.Id} value={deal.Id}>
                      {deal.title_c || deal.title || deal.Name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                )}
              </div>
              
              <div>
                <Label>Description *</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe what happened in this activity..."
                  rows={3}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {activity ? "Update Activity" : "Log Activity"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ActivityModal