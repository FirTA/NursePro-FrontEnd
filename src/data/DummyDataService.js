// DummyDataService.js
const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active' },
  ];
  
  // Simulating API calls with delays
  export const DummyDataService = {
    fetchData: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockData);
        }, 500);
      });
    },
  
    createData: (data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newItem = {
            ...data,
            id: mockData.length + 1,
          };
          mockData.push(newItem);
          resolve(newItem);
        }, 500);
      });
    },
  
    updateData: (id, data) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockData.findIndex(item => item.id === id);
          if (index !== -1) {
            mockData[index] = { ...mockData[index], ...data };
            resolve(mockData[index]);
          }
        }, 500);
      });
    },
  
    deleteData: (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockData.findIndex(item => item.id === id);
          if (index !== -1) {
            mockData.splice(index, 1);
          }
          resolve({ success: true });
        }, 500);
      });
    }
  };
  