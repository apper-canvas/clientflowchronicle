import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"
import { DEAL_STAGES } from "@/utils/dealStages"

const DealModal = ({ isOpen, onClose, deal, contacts, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "lead",
    contactId: "",
    probability: "",
    expectedCloseDate: "",
    notes: ""
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
if (deal) {
      setFormData({
        title: deal.title_c || deal.title || "",
        value: (deal.value_c || deal.value)?.toString() || "",
        stage: deal.stage_c || deal.stage || "lead",
        contactId: (deal.contactId_c || deal.contactId) || "",
        probability: (deal.probability_c || deal.probability)?.toString() || "",
        expectedCloseDate: (deal.expectedCloseDate_c || deal.expectedCloseDate) ? (deal.expectedCloseDate_c || deal.expectedCloseDate).split("T")[0] : "",
        notes: deal.notes_c || deal.notes || ""
      })
    } else {
      setFormData({
        title: "",
        value: "",
        stage: "lead",
        contactId: "",
        probability: "10",
        expectedCloseDate: "",
        notes: ""
      })
    }
    setErrors({})
  }, [deal, isOpen])
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required"
    }
    
    if (!formData.value.trim()) {
      newErrors.value = "Deal value is required"
    } else if (isNaN(parseFloat(formData.value)) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Please enter a valid amount"
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact"
    }
    
    if (!formData.probability.trim()) {
      newErrors.probability = "Probability is required"
    } else {
      const prob = parseInt(formData.probability)
      if (isNaN(prob) || prob < 0 || prob > 100) {
        newErrors.probability = "Probability must be between 0 and 100"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
const dealData = {
      title_c: formData.title,
      value_c: parseFloat(formData.value),
      stage_c: formData.stage,
      contactId_c: formData.contactId ? parseInt(formData.contactId) : null,
      probability_c: parseInt(formData.probability),
      expectedCloseDate_c: formData.expectedCloseDate || null,
      notes_c: formData.notes,
      createdAt_c: deal?.createdAt_c || deal?.createdAt || new Date().toISOString()
    }
    
    if (deal) {
      dealData.Id = deal.Id
    }
    
    onSave(dealData)
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
              {deal ? "Edit Deal" : "Add New Deal"}
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
              <div>
                <Label>Deal Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter deal title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Value *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.value && (
                    <p className="text-sm text-red-600 mt-1">{errors.value}</p>
                  )}
                </div>
                
                <div>
                  <Label>Probability *</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => handleChange("probability", e.target.value)}
                    placeholder="0"
                  />
                  {errors.probability && (
                    <p className="text-sm text-red-600 mt-1">{errors.probability}</p>
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
                <Label>Stage</Label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleChange("stage", e.target.value)}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  {Object.values(DEAL_STAGES).map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>Expected Close Date</Label>
                <Input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
                />
              </div>
              
              <div>
                <Label>Notes</Label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Add notes about this deal..."
                  rows={3}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {deal ? "Update Deal" : "Add Deal"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DealModal