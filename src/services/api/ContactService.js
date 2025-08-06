import contactsData from "@/services/mockData/contacts.json"

export class ContactService {
  static contacts = [...contactsData]
  
  static async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.contacts]
  }
  
  static async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const contact = this.contacts.find(contact => contact.Id === parseInt(id))
    if (!contact) {
      throw new Error("Contact not found")
    }
    return { ...contact }
  }
  
  static async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = Math.max(...this.contacts.map(contact => contact.Id), 0)
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      lastContactedAt: null
    }
    this.contacts.push(newContact)
    return { ...newContact }
  }
  
  static async update(id, contactData) {
    await new Promise(resolve => setTimeout(resolve, 350))
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id)
    }
    return { ...this.contacts[index] }
  }
  
  static async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    
    const deletedContact = this.contacts.splice(index, 1)[0]
    return { ...deletedContact }
  }
}