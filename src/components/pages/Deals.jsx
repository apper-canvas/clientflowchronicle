import { useState, useEffect, useOutletContext } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import DealCard from "@/components/molecules/DealCard"
import Header from "@/components/organisms/Header"
import DealModal from "@/components/organisms/DealModal"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { DealService } from "@/services/api/DealService"
import { ContactService } from "@/services/api/ContactService"
import { DEAL_STAGES, getStageColor } from "@/utils/dealStages"
import { formatCurrency } from "@/utils/formatters"
import { toast } from "react-toastify"

const Deals = () => {
  const { onMobileMenuToggle } = useOutletContext()
  
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [draggedDeal, setDraggedDeal] = useState(null)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [dealsData, contactsData] = await Promise.all([
        DealService.getAll(),
        ContactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError("Failed to load deals. Please try again.")
      console.error("Error loading deals:", err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleAddDeal = () => {
    setSelectedDeal(null)
    setIsModalOpen(true)
  }
  
  const handleEditDeal = (deal) => {
    setSelectedDeal(deal)
    setIsModalOpen(true)
  }
  
  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        await DealService.update(selectedDeal.Id, dealData)
        toast.success("Deal updated successfully!")
      } else {
        await DealService.create(dealData)
        toast.success("Deal added successfully!")
      }
      loadData()
    } catch (err) {
      toast.error("Failed to save deal. Please try again.")
      console.error("Error saving deal:", err)
    }
  }
  
  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await DealService.delete(dealId)
        toast.success("Deal deleted successfully!")
        loadData()
      } catch (err) {
        toast.error("Failed to delete deal. Please try again.")
        console.error("Error deleting deal:", err)
      }
    }
  }
  
  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }
  
  const handleDrop = async (e, newStage) => {
    e.preventDefault()
    
    if (draggedDeal && draggedDeal.stage !== newStage) {
      try {
        const updatedDeal = { ...draggedDeal, stage: newStage }
        
        // Update probability based on stage
        const stageProbabilities = {
          lead: 10,
          qualified: 25,
          proposal: 50,
          negotiation: 75,
          closed: 100
        }
        updatedDeal.probability = stageProbabilities[newStage] || updatedDeal.probability
        
        await DealService.update(draggedDeal.Id, updatedDeal)
        toast.success(`Deal moved to ${DEAL_STAGES[newStage.toUpperCase()].name}!`)
        loadData()
      } catch (err) {
        toast.error("Failed to update deal stage.")
        console.error("Error updating deal stage:", err)
      }
    }
    
    setDraggedDeal(null)
  }
  
  const getDealsForStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId)
  }
  
  const getStageTotal = (stageId) => {
    return getDealsForStage(stageId).reduce((sum, deal) => sum + deal.value, 0)
  }
  
  if (loading) return <Loading />
  
  if (error) {
    return (
      <div className="p-6">
        <Header title="Deals" onMobileMenuToggle={onMobileMenuToggle} />
        <Error message={error} onRetry={loadData} />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Deals" 
        onMobileMenuToggle={onMobileMenuToggle}
      >
        <Button onClick={handleAddDeal} className="gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Deal
        </Button>
      </Header>
      
      <div className="p-6">
        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {Object.values(DEAL_STAGES).map((stage) => {
            const stageDeals = getDealsForStage(stage.id)
            const stageTotal = getStageTotal(stage.id)
            
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stage.order * 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-medium text-gray-900">{stage.name}</h3>
                </div>
                <p className="text-2xl font-bold gradient-text">{formatCurrency(stageTotal)}</p>
                <p className="text-sm text-gray-500">{stageDeals.length} deal{stageDeals.length !== 1 ? "s" : ""}</p>
              </motion.div>
            )
          })}
        </div>
        
        {/* Pipeline Board */}
        {deals.length === 0 ? (
          <Empty
            title="No deals yet"
            description="Start tracking your sales opportunities by adding your first deal"
            actionLabel="Add First Deal"
            onAction={handleAddDeal}
            icon="Briefcase"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px]">
            {Object.values(DEAL_STAGES).map((stage) => {
              const stageDeals = getDealsForStage(stage.id)
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stage.order * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {stageDeals.length}
                    </div>
                  </div>
                  
                  {/* Stage Deals */}
                  <div className="space-y-4 min-h-[200px]">
                    {stageDeals.map((deal) => {
                      const contact = contacts.find(c => c.Id === deal.contactId)
                      
                      return (
                        <div
                          key={deal.Id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal)}
                          className={draggedDeal?.Id === deal.Id ? "opacity-50" : ""}
                        >
                          <DealCard
                            deal={deal}
                            contact={contact}
                            onEdit={handleEditDeal}
                            onDelete={handleDeleteDeal}
                            isDragging={draggedDeal?.Id === deal.Id}
                          />
                        </div>
                      )
                    })}
                    
                    {stageDeals.length === 0 && (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                        <div className="text-center">
                          <ApperIcon name="Briefcase" className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Drop deals here</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        
        {/* Deal Modal */}
        <DealModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          deal={selectedDeal}
          contacts={contacts}
          onSave={handleSaveDeal}
        />
      </div>
    </div>
  )
}

export default Deals