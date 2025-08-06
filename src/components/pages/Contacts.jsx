import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Filter, Plus, Search, Users } from "lucide-react";
import { ContactService } from "@/services/api/ContactService";
import { ActivityService } from "@/services/api/ActivityService";
import { DealService } from "@/services/api/DealService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ContactCard from "@/components/molecules/ContactCard";
import Header from "@/components/organisms/Header";
import ContactModal from "@/components/organisms/ContactModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

const Contacts = () => {
  const { onMobileMenuToggle } = useOutletContext()
  
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [sortBy, setSortBy] = useState("name")
  
  const loadContacts = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await ContactService.getAll()
      setContacts(data)
      setFilteredContacts(data)
    } catch (err) {
      setError("Failed to load contacts. Please try again.")
      console.error("Error loading contacts:", err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadContacts()
  }, [])
  
  useEffect(() => {
    let filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchTerm))
    )
    
    // Sort contacts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "company":
          return (a.company || "").localeCompare(b.company || "")
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })
    
    setFilteredContacts(filtered)
  }, [contacts, searchTerm, sortBy])
  
  const handleAddContact = () => {
    setSelectedContact(null)
    setIsModalOpen(true)
  }
  
  const handleEditContact = (contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }
  
  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await ContactService.update(selectedContact.Id, contactData)
        toast.success("Contact updated successfully!")
      } else {
        await ContactService.create(contactData)
        toast.success("Contact added successfully!")
      }
      loadContacts()
    } catch (err) {
      toast.error("Failed to save contact. Please try again.")
      console.error("Error saving contact:", err)
    }
  }
  
  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await ContactService.delete(contactId)
        toast.success("Contact deleted successfully!")
        loadContacts()
      } catch (err) {
        toast.error("Failed to delete contact. Please try again.")
        console.error("Error deleting contact:", err)
      }
    }
  }
  
  const handleSearch = (term) => {
    setSearchTerm(term)
  }
  
  if (loading) return <Loading />
  
  if (error) {
    return (
      <div className="p-6">
        <Header title="Contacts" onMobileMenuToggle={onMobileMenuToggle} />
        <Error message={error} onRetry={loadContacts} />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Contacts" 
        onMobileMenuToggle={onMobileMenuToggle}
      >
        <Button onClick={handleAddContact} className="gap-2">
          <ApperIcon name="UserPlus" className="h-4 w-4" />
          Add Contact
        </Button>
      </Header>
      
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search contacts by name, email, company, or phone..."
              onSearch={handleSearch}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="company">Company</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>
        
        {/* Contact Stats */}
        {contacts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Users" className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                  <p className="text-sm text-gray-500">Total Contacts</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Building2" className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(contacts.filter(c => c.company).map(c => c.company)).size}
                  </p>
                  <p className="text-sm text-gray-500">Companies</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Search" className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredContacts.length}</p>
                  <p className="text-sm text-gray-500">Showing</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Contacts List */}
        {filteredContacts.length === 0 ? (
          <Empty
            title={contacts.length === 0 ? "No contacts yet" : "No contacts found"}
            description={
              contacts.length === 0
                ? "Start building your network by adding your first contact"
                : "Try adjusting your search terms or filters"
            }
            actionLabel={contacts.length === 0 ? "Add First Contact" : "Clear Search"}
            onAction={contacts.length === 0 ? handleAddContact : () => setSearchTerm("")}
            icon="Users"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ContactCard
                  contact={contact}
                  onClick={handleEditContact}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Contact Modal */}
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contact={selectedContact}
          onSave={handleSaveContact}
        />
      </div>
    </div>
  )
}

export default Contacts