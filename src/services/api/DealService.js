import dealsData from "@/services/mockData/deals.json"

export class DealService {
  static deals = [...dealsData]
  
  static async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.deals]
  }
  
  static async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const deal = this.deals.find(deal => deal.Id === parseInt(id))
    if (!deal) {
      throw new Error("Deal not found")
    }
    return { ...deal }
  }
  
  static async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = Math.max(...this.deals.map(deal => deal.Id), 0)
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString()
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }
  
  static async update(id, dealData) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id)
    }
    return { ...this.deals[index] }
  }
  
  static async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    
    const deletedDeal = this.deals.splice(index, 1)[0]
    return { ...deletedDeal }
  }
  
  static async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.deals.filter(deal => deal.contactId === parseInt(contactId))
  }
  
  static async getByStage(stage) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.deals.filter(deal => deal.stage === stage)
  }
}