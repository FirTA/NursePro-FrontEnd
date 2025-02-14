// users.js
export const users = [
    {
      id: 1,
      username: "john.nurse",
      email: "john@hospital.com",
      email_verified: true,
      role: "nurse",
      department: "Emergency",
      account_id: "N12345",
      phone: "555-0101",
      first_name: "John",
      last_name: "Doe",
      created_at: "2024-01-01T08:00:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      username: "sarah.mgmt",
      email: "sarah@hospital.com",
      email_verified: true,
      role: "management",
      department: "Nursing Administration",
      account_id: "N12346",
      phone: "555-0102",
      first_name: "Sarah",
      last_name: "Johnson",
      created_at: "2024-01-02T09:00:00Z",
      updated_at: "2024-01-16T11:30:00Z"
    },
    {
      id: 3,
      username: "mike.admin",
      email: "mike@hospital.com",
      email_verified: true,
      role: "admin",
      department: "Administration",
      account_id: "N12347",
      phone: "555-0103",
      first_name: "Mike",
      last_name: "Wilson",
      created_at: "2024-01-03T10:00:00Z",
      updated_at: "2024-01-17T12:30:00Z"
    },
    {
      id: 4,
      username: "emma.nurse",
      email: "emma@hospital.com",
      email_verified: true,
      role: "nurse",
      department: "Pediatrics",
      account_id: "N12348",
      phone: "555-0104",
      first_name: "Emma",
      last_name: "Brown",
      created_at: "2024-01-04T11:00:00Z",
      updated_at: "2024-01-18T13:30:00Z"
    },
    {
      id: 5,
      username: "david.nurse",
      email: "david@hospital.com",
      email_verified: true,
      role: "nurse",
      department: "ICU",
      account_id: "N12349",
      phone: "555-0105",
      first_name: "David",
      last_name: "Smith",
      created_at: "2024-01-05T12:00:00Z",
      updated_at: "2024-01-19T14:30:00Z"
    },
    {
      id: 6,
      username: "lisa.mgmt",
      email: "lisa@hospital.com",
      email_verified: true,
      role: "management",
      department: "ICU Administration",
      account_id: "N12350",
      phone: "555-0106",
      first_name: "Lisa",
      last_name: "Anderson",
      created_at: "2024-01-06T13:00:00Z",
      updated_at: "2024-01-20T15:30:00Z"
    },
    {
      id: 7,
      username: "mark.nurse",
      email: "mark@hospital.com",
      email_verified: false,
      role: "nurse",
      department: "Surgery",
      account_id: "N12351",
      phone: "555-0107",
      first_name: "Mark",
      last_name: "Taylor",
      created_at: "2024-01-07T14:00:00Z",
      updated_at: "2024-01-21T16:30:00Z"
    },
    {
      id: 8,
      username: "amy.mgmt",
      email: "amy@hospital.com",
      email_verified: true,
      role: "management",
      department: "Surgery Administration",
      account_id: "N12352",
      phone: "555-0108",
      first_name: "Amy",
      last_name: "Martinez",
      created_at: "2024-01-08T15:00:00Z",
      updated_at: "2024-01-22T17:30:00Z"
    }
  ];
  
  // levelCategories.js
  export const levelCategories = [
    {
      id: 1,
      code: "N1",
      name: "Nurse Level 1",
      description: "Entry level nursing position",
      next_level: 2,
      minimum_years: 1,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      code: "N2",
      name: "Nurse Level 2",
      description: "Intermediate level nursing position",
      next_level: 3,
      minimum_years: 2,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      code: "N3",
      name: "Nurse Level 3",
      description: "Senior level nursing position",
      next_level: 4,
      minimum_years: 4,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      code: "N4",
      name: "Nurse Level 4",
      description: "Expert level nursing position",
      next_level: 5,
      minimum_years: 6,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 5,
      code: "N5",
      name: "Nurse Level 5",
      description: "Master level nursing position",
      next_level: null,
      minimum_years: 8,
      created_at: "2024-01-01T00:00:00Z"
    }
  ];
  
  // nurses.js
  export const nurses = [
    {
      id: 1,
      user: 1,
      current_level: 1,
      level_updated_at: "2024-01-01T08:00:00Z",
      years_of_service: 1,
      specialization: "Emergency Care",
      is_active: true
    },
    {
      id: 2,
      user: 4,
      current_level: 2,
      level_updated_at: "2024-01-02T09:00:00Z",
      years_of_service: 3,
      specialization: "Pediatric Care",
      is_active: true
    },
    {
      id: 3,
      user: 5,
      current_level: 3,
      level_updated_at: "2024-01-03T10:00:00Z",
      years_of_service: 5,
      specialization: "Critical Care",
      is_active: true
    },
    {
      id: 4,
      user: 7,
      current_level: 2,
      level_updated_at: "2024-01-04T11:00:00Z",
      years_of_service: 2,
      specialization: "Surgical Care",
      is_active: false
    }
  ];
  
  // consultations.js
  export const consultations = [
    {
      id: 1,
      nurses: [1, 2],
      management: 2,
      consultation_type: "regular",
      status: "scheduled",
      scheduled_date: "2024-01-20T10:00:00Z",
      completed_date: null,
      notes: "Regular performance review",
      created_at: "2024-01-15T08:00:00Z",
      updated_at: "2024-01-15T08:00:00Z"
    },
    {
      id: 2,
      nurses: [1],
      management: 2,
      consultation_type: "violation",
      status: "completed",
      scheduled_date: "2024-01-10T14:00:00Z",
      completed_date: "2024-01-10T15:00:00Z",
      notes: "Discussion about late arrivals",
      created_at: "2024-01-05T09:00:00Z",
      updated_at: "2024-01-10T15:00:00Z"
    },
    {
      id: 3,
      nurses: [2, 3],
      management: 6,
      consultation_type: "regular",
      status: "in_progress",
      scheduled_date: "2024-01-18T13:00:00Z",
      completed_date: null,
      notes: "Quarterly performance evaluation",
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-18T13:00:00Z"
    },
    {
      id: 4,
      nurses: [3],
      management: 8,
      consultation_type: "regular",
      status: "cancelled",
      scheduled_date: "2024-01-15T15:00:00Z",
      completed_date: null,
      notes: "Cancelled due to emergency",
      created_at: "2024-01-08T11:00:00Z",
      updated_at: "2024-01-14T14:00:00Z"
    },
    {
      id: 5,
      nurses: [4],
      management: 6,
      consultation_type: "violation",
      status: "completed",
      scheduled_date: "2024-01-12T11:00:00Z",
      completed_date: "2024-01-12T12:00:00Z",
      notes: "Discussion about documentation issues",
      created_at: "2024-01-07T09:00:00Z",
      updated_at: "2024-01-12T12:00:00Z"
    }
  ];
  
  // consultationNotes.js
  export const consultationNotes = [
    {
      id: 1,
      consultation: 1,
      created_by: 2,
      content: "Nurse showed good progress in emergency response times",
      created_at: "2024-01-20T11:00:00Z",
      is_private: false
    },
    {
      id: 2,
      consultation: 2,
      created_by: 2,
      content: "Discussed importance of punctuality and its impact on team performance",
      created_at: "2024-01-10T15:30:00Z",
      is_private: true
    },
    {
      id: 3,
      consultation: 3,
      created_by: 6,
      content: "Excellent progress in patient care and team collaboration",
      created_at: "2024-01-18T14:00:00Z",
      is_private: false
    },
    {
      id: 4,
      consultation: 4,
      created_by: 8,
      content: "Consultation cancelled due to emergency in surgery department",
      created_at: "2024-01-14T14:00:00Z",
      is_private: false
    },
    {
      id: 5,
      consultation: 5,
      created_by: 6,
      content: "Improvement plan discussed for documentation procedures",
      created_at: "2024-01-12T12:30:00Z",
      is_private: true
    }
  ];
  
  // levelUpgrades.js
  export const levelUpgrades = [
    {
      id: 1,
      nurse: 1,
      from_level: 1,
      to_level: 2,
      requested_at: "2024-01-15T09:00:00Z",
      status: "pending",
      approved_by: null,
      approval_date: null,
      rejection_reason: ""
    },
    {
      id: 2,
      nurse: 2,
      from_level: 2,
      to_level: 3,
      requested_at: "2024-01-10T14:00:00Z",
      status: "approved",
      approved_by: 2,
      approval_date: "2024-01-12T10:00:00Z",
      rejection_reason: ""
    },
    {
      id: 3,
      nurse: 3,
      from_level: 3,
      to_level: 4,
      requested_at: "2024-01-05T10:00:00Z",
      status: "rejected",
      approved_by: 6,
      approval_date: "2024-01-07T15:00:00Z",
      rejection_reason: "Insufficient years of service"
    },
    {
      id: 4,
      nurse: 4,
      from_level: 2,
      to_level: 3,
      requested_at: "2024-01-08T11:00:00Z",
      status: "pending",
      approved_by: null,
      approval_date: null,
      rejection_reason: ""
    }
  ];
  
  // materials.js
  export const materials = [
    {
      id: 1,
      title: "Patient Care Guidelines 2024",
      description: "Updated guidelines for patient care procedures",
      content: "Detailed content about patient care procedures...",
      file: "materials/2024/01/patient_care_guidelines.pdf",
      consultation: 1,
      created_by: 2,
      created_at: "2024-01-15T08:00:00Z",
      updated_at: "2024-01-15T08:00:00Z",
      is_required: true,
      read_by: [1, 2]
    },
    {
      id: 2,
      title: "Time Management Workshop Materials",
      description: "Resources for improving punctuality and efficiency",
      content: "Time management strategies and best practices...",
      file: "materials/2024/01/time_management.pdf",
      consultation: 2,
      created_by: 2,
      created_at: "2024-01-09T10:00:00Z",
      updated_at: "2024-01-09T10:00:00Z",
      is_required: true,
      read_by: [1]
    },
    {
      id: 3,
      title: "Quarterly Performance Metrics",
      description: "Performance evaluation criteria and metrics",
      content: "Detailed breakdown of performance indicators...",
      file: "materials/2024/01/performance_metrics.pdf",
      consultation: 3,
      created_by: 6,
      created_at: "2024-01-17T09:00:00Z",
      updated_at: "2024-01-17T09:00:00Z",
      is_required: true,
      read_by: [2, 3]
    },
    {
      id: 4,
      title: "Documentation Best Practices",
      description: "Guide for proper medical documentation",
      content: "Comprehensive documentation guidelines...",
      file: "materials/2024/01/documentation_guide.pdf",
      consultation: 5,
      created_by: 6,
      created_at: "2024-01-11T10:00:00Z",
      updated_at: "2024-01-11T10:00:00Z",
      is_required: true,
      read_by: [4]
    }
  ];
  
// materialReadStatus.js (continued)
export const materialReadStatus = [
    {
      id: 1,
      material: 1,
      nurse: 1,
      read_at: "2024-01-16T10:00:00Z",
      understood: true,
      feedback: "Clear and helpful guidelines"
    },
    {
      id: 2,
      material: 1,
      nurse: 2,
      read_at: "2024-01-16T14:00:00Z",
      understood: true,
      feedback: "Very comprehensive information"
    },
    {
      id: 3,
      material: 2,
      nurse: 1,
      read_at: "2024-01-09T16:00:00Z",
      understood: true,
      feedback: "Useful strategies for improving time management"
    },
    {
      id: 4,
      material: 3,
      nurse: 2,
      read_at: "2024-01-17T11:00:00Z",
      understood: true,
      feedback: "Metrics are well-defined and measurable"
    },
    {
      id: 5,
      material: 3,
      nurse: 3,
      read_at: "2024-01-17T13:00:00Z",
      understood: false,
      feedback: "Need clarification on some performance indicators"
    },
    {
      id: 6,
      material: 4,
      nurse: 4,
      read_at: "2024-01-11T15:00:00Z",
      understood: true,
      feedback: "Documentation requirements are now clear"
    }
  ];
  
  // Helper function to get related data
  export const getRelatedData = {
    // Get user details for a nurse
    getNurseUser: (nurseId) => {
      const nurse = nurses.find(n => n.id === nurseId);
      return users.find(u => u.id === nurse?.user);
    },
  
    // Get all consultations for a nurse
    getNurseConsultations: (nurseId) => {
      return consultations.filter(c => c.nurses.includes(nurseId));
    },
  
    // Get all materials for a consultation
    getConsultationMaterials: (consultationId) => {
      return materials.filter(m => m.consultation === consultationId);
    },
  
    // Get all notes for a consultation
    getConsultationNotes: (consultationId) => {
      return consultationNotes.filter(n => n.consultation === consultationId);
    },
  
    // Get level category details
    getLevelCategory: (levelId) => {
      return levelCategories.find(l => l.id === levelId);
    },
  
    // Get all level upgrades for a nurse
    getNurseLevelUpgrades: (nurseId) => {
      return levelUpgrades.filter(u => u.nurse === nurseId);
    },
  
    // Get all read materials for a nurse
    getNurseReadMaterials: (nurseId) => {
      return materialReadStatus.filter(m => m.nurse === nurseId);
    },
  
    // Get management user details
    getManagementUser: (userId) => {
      return users.find(u => u.id === userId && u.role === 'management');
    }
  };
  
  // Example usage of the complete dataset:
  /*
  // Get all consultations for a specific nurse with related data
  const getNurseConsultationDetails = (nurseId) => {
    const consultations = getRelatedData.getNurseConsultations(nurseId);
    return consultations.map(consultation => ({
      ...consultation,
      materials: getRelatedData.getConsultationMaterials(consultation.id),
      notes: getRelatedData.getConsultationNotes(consultation.id),
      management: getRelatedData.getManagementUser(consultation.management)
    }));
  };
  
  // Get complete nurse profile
  const getNurseProfile = (nurseId) => {
    const nurse = nurses.find(n => n.id === nurseId);
    return {
      ...nurse,
      user: getRelatedData.getNurseUser(nurseId),
      currentLevel: getRelatedData.getLevelCategory(nurse.current_level),
      levelUpgrades: getRelatedData.getNurseLevelUpgrades(nurseId),
      readMaterials: getRelatedData.getNurseReadMaterials(nurseId)
    };
  };
  */