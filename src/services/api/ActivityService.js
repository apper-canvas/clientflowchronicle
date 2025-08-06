export class ActivityService {
  
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
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "contactId_c" } },
          { field: { Name: "dealId_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching activities:", error.message);
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
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "contactId_c" } },
          { field: { Name: "dealId_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("activity_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching activity with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields
      const createData = {
        Name: activityData.Name || activityData.description_c || activityData.description,
        Tags: Array.isArray(activityData.Tags) ? activityData.Tags.join(',') : (activityData.tags?.join(',') || ''),
        type_c: activityData.type_c || activityData.type,
        description_c: activityData.description_c || activityData.description,
        date_c: activityData.date_c || activityData.date,
        duration_c: activityData.duration_c || activityData.duration,
        contactId_c: activityData.contactId_c || activityData.contactId ? parseInt(activityData.contactId_c || activityData.contactId) : null,
        dealId_c: activityData.dealId_c || activityData.dealId ? parseInt(activityData.dealId_c || activityData.dealId) : null
      };
      
      const params = {
        records: [createData]
      };
      
      const response = await apperClient.createRecord("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating activity:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating activity:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async update(id, activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields plus Id
      const updateData = {
        Id: parseInt(id),
        Name: activityData.Name || activityData.description_c || activityData.description,
        Tags: Array.isArray(activityData.Tags) ? activityData.Tags.join(',') : (activityData.tags?.join(',') || ''),
        type_c: activityData.type_c || activityData.type,
        description_c: activityData.description_c || activityData.description,
        date_c: activityData.date_c || activityData.date,
        duration_c: activityData.duration_c || activityData.duration,
        contactId_c: activityData.contactId_c || activityData.contactId ? parseInt(activityData.contactId_c || activityData.contactId) : null,
        dealId_c: activityData.dealId_c || activityData.dealId ? parseInt(activityData.dealId_c || activityData.dealId) : null
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating activity:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating activity:", error.message);
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
      
      const response = await apperClient.deleteRecord("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete activities ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting activity:", error.message);
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
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "contactId_c" } },
          { field: { Name: "dealId_c" } }
        ],
        where: [
          {
            FieldName: "contactId_c",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities by contact ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching activities by contact ID:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async getByDealId(dealId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "contactId_c" } },
          { field: { Name: "dealId_c" } }
        ],
        where: [
          {
            FieldName: "dealId_c",
            Operator: "EqualTo",
            Values: [parseInt(dealId)]
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities by deal ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching activities by deal ID:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  static async getByType(type) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "contactId_c" } },
          { field: { Name: "dealId_c" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [type]
          }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities by type:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching activities by type:", error.message);
        throw new Error(error.message);
      }
    }
  }
  
  // Legacy methods for backward compatibility
  static async getAll() {
    return this.fetchAll();
  }
}