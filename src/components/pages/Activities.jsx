import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ActivityItem from "@/components/molecules/ActivityItem"
import Header from "@/components/organisms/Header"
import ActivityModal from "@/components/organisms/ActivityModal"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { ActivityService } from "@/services/api/ActivityService"
import { ContactService } from "@/services/api/ContactService"
import { DealService } from "@/services/api/DealService"
import { ACTIVITY_TYPES } from "@/utils/dealStages"
import { formatDate } from "@/utils/formatters"
import { toast } from "react-toastify"

const Activities = () => {
  const { onMobileMenuToggle } = useOutletContext()
  
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        ActivityService.getAll(),
        ContactService.getAll(),
        DealService.getAll()
      ])
      setActivities(activitiesData)
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError("Failed to load activities. Please try again.")
      console.error("Error loading activities:", err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  useEffect(() => {
    let filtered = activities
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(activity => activity.type === filterType)
    }
    
    // Sort activities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.date) - new Date(a.date)
        case "oldest":
          return new Date(a.date) - new Date(b.date)
        case "type":
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })
    
    setFilteredActivities(filtered)
  }, [activities, filterType, sortBy])
  
  const handleAddActivity = () => {
    setSelectedActivity(null)
    setIsModalOpen(true)
  }
  
  const handleEditActivity = (activity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }
  
  const handleSaveActivity = async (activityData) => {
    try {
      if (selectedActivity) {
        await ActivityService.update(selectedActivity.Id, activityData)
        toast.success("Activity updated successfully!")
      } else {
        await ActivityService.create(activityData)
        toast.success("Activity logged successfully!")
      }
      loadData()
    } catch (err) {
      toast.error("Failed to save activity. Please try again.")
      console.error("Error saving activity:", err)
    }
  }
  
  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await ActivityService.delete(activityId)
        toast.success("Activity deleted successfully!")
        loadData()
      } catch (err) {
        toast.error("Failed to delete activity. Please try again.")
        console.error("Error deleting activity:", err)
      }
    }
  }
  
  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = formatDate(activity.date)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {})
  
  if (loading) return <Loading />
  
  if (error) {
    return (
      <div className="p-6">
        <Header title="Activities" onMobileMenuToggle={onMobileMenuToggle} />
        <Error message={error} onRetry={loadData} />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Activities" 
        onMobileMenuToggle={onMobileMenuToggle}
      >
        <Button onClick={handleAddActivity} className="gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Log Activity
        </Button>
      </Header>
      
      <div className="p-6">
        {/* Activity Stats */}
        {activities.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Activity" className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </motion.div>
            
            {Object.values(ACTIVITY_TYPES).map((type, index) => {
              const count = activities.filter(a => a.type === type.id).length
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${type.bgColor} rounded-xl flex items-center justify-center`}>
                      <ApperIcon name={type.icon} className={`h-5 w-5 ${type.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-500">{type.name}s</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              {Object.values(ACTIVITY_TYPES).map((type) => (
                <Button
                  key={type.id}
                  variant={filterType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type.id)}
                  className="gap-1"
                >
                  <ApperIcon name={type.icon} className="h-3 w-3" />
                  {type.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="type">Activity Type</option>
            </select>
          </div>
        </div>
        
        {/* Activities Timeline */}
        {filteredActivities.length === 0 ? (
          <Empty
            title={activities.length === 0 ? "No activities yet" : "No activities found"}
            description={
              activities.length === 0
                ? "Start logging your customer interactions and communications"
                : "Try adjusting your filters to see more activities"
            }
            actionLabel={activities.length === 0 ? "Log First Activity" : "Clear Filters"}
            onAction={activities.length === 0 ? handleAddActivity : () => setFilterType("all")}
            icon="Activity"
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, dayActivities]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Date Header */}
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{date}</h3>
                  <div className="flex-1 h-px bg-gray-200" />
                  <Badge variant="outline">{dayActivities.length} activities</Badge>
                </div>
                
                {/* Day Activities */}
                <div className="space-y-4">
                  {dayActivities.map((activity) => {
                    const contact = contacts.find(c => c.Id === activity.contactId)
                    const deal = deals.find(d => d.Id === activity.dealId)
                    
                    return (
                      <ActivityItem
                        key={activity.Id}
                        activity={activity}
                        contact={contact}
                        deal={deal}
                      />
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Activity Modal */}
        <ActivityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activity={selectedActivity}
          contacts={contacts}
          deals={deals}
          onSave={handleSaveActivity}
        />
      </div>
    </div>
  )
}

export default Activities