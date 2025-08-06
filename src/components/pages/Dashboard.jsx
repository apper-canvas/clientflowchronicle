import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Header from "@/components/organisms/Header"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { ContactService } from "@/services/api/ContactService"
import { DealService } from "@/services/api/DealService"
import { ActivityService } from "@/services/api/ActivityService"
import { formatCurrency, formatRelativeTime, formatPercentage } from "@/utils/formatters"
import { getStageColor, getActivityType } from "@/utils/dealStages"

const Dashboard = () => {
  const { onMobileMenuToggle } = useOutletContext()
  const navigate = useNavigate()
  
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
const [contactsData, dealsData, activitiesData] = await Promise.all([
        ContactService.fetchAll(),
        DealService.fetchAll(),
        ActivityService.fetchAll()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
      setActivities(activitiesData.slice(0, 10)) // Show only recent activities
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
      console.error("Error loading dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  // Calculate metrics
  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const averageDealSize = deals.length > 0 ? totalDealValue / deals.length : 0
  const conversionRate = deals.length > 0 ? (deals.filter(d => d.stage === "closed").length / deals.length) * 100 : 0
  
  const dealsByStage = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1
    return acc
  }, {})
  
  if (loading) return <Loading />
  
  if (error) {
    return (
      <div className="p-6">
        <Header title="Dashboard" onMobileMenuToggle={onMobileMenuToggle} />
        <Error message={error} onRetry={loadData} />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Dashboard" 
        onMobileMenuToggle={onMobileMenuToggle}
      >
        <Button 
          onClick={() => navigate("/contacts")}
          className="gap-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          Quick Add
        </Button>
      </Header>
      
      <div className="p-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-100 text-sm font-medium">Total Pipeline</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalDealValue)}</p>
                    <p className="text-primary-100 text-xs mt-1">{deals.length} active deals</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ApperIcon name="TrendingUp" className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white border-0 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-100 text-sm font-medium">Contacts</p>
                    <p className="text-3xl font-bold">{contacts.length}</p>
                    <p className="text-secondary-100 text-xs mt-1">Active relationships</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ApperIcon name="Users" className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white border-0 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-accent-100 text-sm font-medium">Avg Deal Size</p>
                    <p className="text-3xl font-bold">{formatCurrency(averageDealSize)}</p>
                    <p className="text-accent-100 text-xs mt-1">Per opportunity</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ApperIcon name="DollarSign" className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Win Rate</p>
                    <p className="text-3xl font-bold">{formatPercentage(conversionRate)}</p>
                    <p className="text-green-100 text-xs mt-1">Conversion rate</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ApperIcon name="Target" className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="h-fit">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pipeline Overview</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate("/deals")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {deals.length === 0 ? (
                  <Empty
                    title="No deals yet"
                    description="Start by adding your first deal to track your sales pipeline"
                    actionLabel="Add Deal"
                    onAction={() => navigate("/deals")}
                    icon="Briefcase"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(dealsByStage).map(([stage, count]) => {
                      const stageInfo = getStageColor(stage)
                      const stageDeals = deals.filter(d => d.stage === stage)
                      const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
                      
                      return (
                        <motion.div
                          key={stage}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-xl border-2 border-gray-200 hover:border-primary-200 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${stageInfo.color}`} />
                              <h4 className="font-medium text-gray-900">{stageInfo.name}</h4>
                            </div>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                          <p className="text-2xl font-bold gradient-text">{formatCurrency(stageValue)}</p>
                          <p className="text-sm text-gray-500 mt-1">{count} deal{count !== 1 ? "s" : ""}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-fit">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activities</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate("/activities")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <Empty
                    title="No activities yet"
                    description="Start logging your customer interactions"
                    actionLabel="Log Activity"
                    onAction={() => navigate("/activities")}
                    icon="Activity"
                    className="py-8"
                  />
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => {
const contact = contacts.find(c => c.Id === (activity.contactId_c || activity.contactId))
                      const deal = deals.find(d => d.Id === activity.dealId)
                      const activityType = getActivityType(activity.type)
                      
                      return (
                        <motion.div
                          key={activity.Id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activityType.bgColor} flex items-center justify-center`}>
                            <ApperIcon name={activityType.icon} className={`h-4 w-4 ${activityType.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {activityType.name} with {contact?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{formatRelativeTime(activity.date)}</span>
                              {deal && (
                                <>
                                  <span>•</span>
                                  <span>{deal.title}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => navigate("/contacts")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <ApperIcon name="UserPlus" className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">Add Contact</p>
                      <p className="text-sm text-gray-500">Create new relationship</p>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => navigate("/deals")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Plus" className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <p className="font-medium">Create Deal</p>
                      <p className="text-sm text-gray-500">Track new opportunity</p>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => navigate("/activities")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Calendar" className="h-5 w-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-medium">Log Activity</p>
                      <p className="text-sm text-gray-500">Record interaction</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard