export class DealService {
  
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
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contactId_c" } }
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
      
      const response = await apperClient.fetchRecords("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching deals:", error.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contactId_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("deal_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching deal with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const createData = {
        Name: dealData.Name || dealData.title_c || dealData.title,
        Tags: Array.isArray(dealData.Tags) ? dealData.Tags.join(',') : (dealData.tags?.join(',') || ''),
        title_c: dealData.title_c || dealData.title,
        value_c: dealData.value_c || dealData.value,
        stage_c: dealData.stage_c || dealData.stage,
        probability_c: dealData.probability_c || dealData.probability,
        expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate,
        createdAt_c: dealData.createdAt_c || new Date().toISOString(),
        notes_c: dealData.notes_c || dealData.notes,
        contactId_c: dealData.contactId_c || dealData.contactId ? parseInt(dealData.contactId_c || dealData.contactId) : null
      };
      
      const params = {
        records: [createData]
      };
      
      const response = await apperClient.createRecord("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create deal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating deal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating deal:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async update(id, dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields plus Id
      const updateData = {
        Id: parseInt(id),
        Name: dealData.Name || dealData.title_c || dealData.title,
        Tags: Array.isArray(dealData.Tags) ? dealData.Tags.join(',') : (dealData.tags?.join(',') || ''),
        title_c: dealData.title_c || dealData.title,
        value_c: dealData.value_c || dealData.value,
        stage_c: dealData.stage_c || dealData.stage,
        probability_c: dealData.probability_c || dealData.probability,
        expectedCloseDate_c: dealData.expectedCloseDate_c || dealData.expectedCloseDate,
        createdAt_c: dealData.createdAt_c,
        notes_c: dealData.notes_c || dealData.notes,
        contactId_c: dealData.contactId_c || dealData.contactId ? parseInt(dealData.contactId_c || dealData.contactId) : null
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update deal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating deal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating deal:", error.message);
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
      
      const response = await apperClient.deleteRecord("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete deals ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting deal:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async getByContactId(contactId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contactId_c" } }
        ],
        where: [
          {
            FieldName: "contactId_c",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals by contact ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching deals by contact ID:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async getByStage(stage) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "probability_c" } },
          { field: { Name: "expectedCloseDate_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contactId_c" } }
        ],
        where: [
          {
            FieldName: "stage_c",
            Operator: "EqualTo",
            Values: [stage]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("deal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals by stage:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching deals by stage:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  // Legacy methods for backward compatibility
  static async getAll() {
    return this.fetchAll();
  }
}