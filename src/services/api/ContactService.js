export class ContactService {
  
  static async fetchAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "lastContactedAt_c" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching contacts:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching contacts:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "lastContactedAt_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("contact_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching contact with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const createData = {
        Name: contactData.Name || contactData.name,
        Tags: Array.isArray(contactData.Tags) ? contactData.Tags.join(',') : (contactData.tags?.join(',') || ''),
        email_c: contactData.email_c || contactData.email,
        phone_c: contactData.phone_c || contactData.phone,
        company_c: contactData.company_c || contactData.company,
        position_c: contactData.position_c || contactData.position,
        createdAt_c: contactData.createdAt_c || new Date().toISOString(),
        lastContactedAt_c: contactData.lastContactedAt_c || null
      };
      
      const params = {
        records: [createData]
      };
      
      const response = await apperClient.createRecord("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord ? successfulRecord.data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating contact:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating contact:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async update(id, contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields plus Id
      const updateData = {
        Id: parseInt(id),
        Name: contactData.Name || contactData.name,
        Tags: Array.isArray(contactData.Tags) ? contactData.Tags.join(',') : (contactData.tags?.join(',') || ''),
        email_c: contactData.email_c || contactData.email,
        phone_c: contactData.phone_c || contactData.phone,
        company_c: contactData.company_c || contactData.company,
        position_c: contactData.position_c || contactData.position,
        createdAt_c: contactData.createdAt_c,
        lastContactedAt_c: contactData.lastContactedAt_c
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecord = response.results.find(result => result.success);
        return successfulRecord ? successfulRecord.data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating contact:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating contact:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("contact_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete contacts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting contact:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  // Legacy methods for backward compatibility
  static async getAll() {
    return this.fetchAll();
}
}