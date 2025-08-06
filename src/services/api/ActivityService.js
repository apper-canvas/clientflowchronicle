import activitiesData from "@/services/mockData/activities.json"

export class ActivityService {
  static activities = [...activitiesData]
  
  static async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.activities].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  static async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const activity = this.activities.find(activity => activity.Id === parseInt(id))
    if (!activity) {
      throw new Error("Activity not found")
    }
    return { ...activity }
  }
  
  static async create(activityData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = Math.max(...this.activities.map(activity => activity.Id), 0)
    const newActivity = {
      Id: maxId + 1,
      ...activityData
    }
    this.activities.push(newActivity)
    return { ...newActivity }
  }
  
  static async update(id, activityData) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id)
    }
    return { ...this.activities[index] }
  }
  
  static async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    
    const deletedActivity = this.activities.splice(index, 1)[0]
    return { ...deletedActivity }
  }
  
  static async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.activities
      .filter(activity => activity.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  static async getByDealId(dealId) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.activities
      .filter(activity => activity.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  static async getByType(type) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return this.activities
      .filter(activity => activity.type === type)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }
}