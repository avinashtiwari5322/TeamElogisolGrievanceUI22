import { useState, useEffect } from 'react';
import { Request, Mail, Priority, Status, User, Attachment } from '../types';

// Mock data
const mockPriorities: Priority[] = [
  { priorityId: 1, priorityName: 'High', isActive: true },
  { priorityId: 2, priorityName: 'Medium', isActive: true },
  { priorityId: 3, priorityName: 'Low', isActive: true }
];

const mockStatuses: Status[] = [
  { statusId: 1, statusName: 'Pending', isActive: true },
  { statusId: 2, statusName: 'Active', isActive: true },
  { statusId: 3, statusName: 'Dev', isActive: true },
  { statusId: 4, statusName: 'Stag', isActive: true },
  { statusId: 5, statusName: 'Uat', isActive: true },
  { statusId: 6, statusName: 'Live', isActive: true },
  { statusId: 7, statusName: 'Closed', isActive: true }
];

const mockUsers: User[] = [
  {
    userId: 1,
    userName: 'admin',
    email: 'admin@elogisol.com',
    roleId: 1,
    roleName: 'Admin',
    userType: 'Admin',
    isActive: true
  },
  {
    userId: 2,
    userName: 'john_doe',
    email: 'john@company.com',
    roleId: 2,
    roleName: 'Customer',
    userType: 'User',
    companyId: 1,
    companyName: 'Tech Corp',
    isActive: true
  }
];

const generateMockRequests = (): Request[] => [
  {
    requestId: 1,
    subject: 'Login Issues with Mobile App',
    message: 'Users are experiencing login failures on the mobile application. The error occurs after entering correct credentials.',
    requestType: 'System Bug',
    priorityId: 1,
    priority: mockPriorities[0],
    statusId: 2,
    status: mockStatuses[1],
    createdBy: 2,
    createdByUser: mockUsers[1],
    createdOn: '2025-01-15T10:30:00Z',
    assignedTo: 1,
    assignedToUser: mockUsers[0],
    assignedOn: '2025-01-15T11:00:00Z',
    devTargetDate: '2025-01-20T00:00:00Z',
    devRemark: 'Investigating authentication service',
    mailCount: 3,
    lastActivity: '2025-01-15T14:20:00Z'
  },
  {
    requestId: 2,
    subject: 'Feature Request: Dark Mode',
    message: 'It would be great to have a dark mode option in the application for better user experience during night time usage.',
    requestType: 'New Development',
    priorityId: 2,
    priority: mockPriorities[1],
    statusId: 3,
    status: mockStatuses[2],
    createdBy: 2,
    createdByUser: mockUsers[1],
    createdOn: '2025-01-14T09:15:00Z',
    mailCount: 1,
    lastActivity: '2025-01-14T16:45:00Z'
  },
  {
    requestId: 3,
    subject: 'Performance Issues in Dashboard',
    message: 'The dashboard is loading very slowly, especially when displaying large datasets. This is affecting productivity.',
    requestType: 'System Bug',
    priorityId: 1,
    priority: mockPriorities[0],
    statusId: 1,
    status: mockStatuses[0],
    createdBy: 2,
    createdByUser: mockUsers[1],
    createdOn: '2025-01-13T15:45:00Z',
    mailCount: 0,
    lastActivity: '2025-01-13T15:45:00Z'
  }
];

const generateMockMails = (requestId: number): Mail[] => {
  if (requestId === 1) {
    return [
      {
        mailId: 1,
        requestId: 1,
        subject: 'Re: Login Issues with Mobile App',
        body: 'Thank you for reporting this issue. Our team is investigating the login problems. Can you please provide more details about the device and OS version you\'re using?',
        fromAddress: 'admin@elogisol.com',
        toAddresses: 'john@company.com',
        sentOn: '2025-01-15T11:00:00Z',
        isRead: true,
        isStarred: false,
        hasAttachment: false,
        createdBy: 1,
        createdByUser: mockUsers[0]
      },
      {
        mailId: 2,
        requestId: 1,
        parentMailId: 1,
        subject: 'Re: Login Issues with Mobile App',
        body: 'I\'m using iPhone 14 with iOS 17.2. The issue happens consistently after the latest app update.',
        fromAddress: 'john@company.com',
        toAddresses: 'admin@elogisol.com',
        sentOn: '2025-01-15T12:30:00Z',
        isRead: true,
        isStarred: false,
        hasAttachment: false,
        createdBy: 2,
        createdByUser: mockUsers[1]
      }
    ];
  }
  return [];
};

const generateAllMails = (): Mail[] => {
  return [
    {
      mailId: 1,
      requestId: 1,
      subject: 'Login Issues with Mobile App - Initial Report',
      body: 'Hello Team,\n\nWe are experiencing login failures on the mobile application. Users are unable to authenticate even with correct credentials. This started happening after the latest app update.\n\nPlease investigate this issue urgently as it\'s affecting multiple customers.\n\nBest regards,\nJohn Doe',
      fromAddress: 'john@company.com',
      toAddresses: 'support@elogisol.com',
      sentOn: '2025-01-15T10:30:00Z',
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      createdBy: 2,
      createdByUser: mockUsers[1]
    },
    {
      mailId: 2,
      requestId: 1,
      subject: 'Re: Login Issues with Mobile App',
      body: 'Hi John,\n\nThank you for reporting this issue. Our development team is investigating the login problems. Can you please provide more details about:\n\n1. Device model and OS version\n2. App version number\n3. Any error messages displayed\n\nThis will help us reproduce and fix the issue faster.\n\nBest regards,\nAdmin Team',
      fromAddress: 'admin@elogisol.com',
      toAddresses: 'john@company.com',
      ccAddresses: 'support@elogisol.com',
      sentOn: '2025-01-15T11:00:00Z',
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      createdBy: 1,
      createdByUser: mockUsers[0]
    },
    {
      mailId: 3,
      requestId: 2,
      subject: 'Feature Request: Dark Mode Implementation',
      body: 'Dear Development Team,\n\nI would like to request the implementation of a dark mode feature in the application. This would greatly improve user experience, especially for users who work during night hours.\n\nDark mode has become a standard feature in most modern applications and would be a valuable addition to our software.\n\nThank you for considering this request.\n\nBest regards,\nJohn Doe',
      fromAddress: 'john@company.com',
      toAddresses: 'dev@elogisol.com',
      sentOn: '2025-01-14T09:15:00Z',
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      createdBy: 2,
      createdByUser: mockUsers[1]
    }
  ];
};
export const useRequests = (userId?: number) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRequests = generateMockRequests();
      setRequests(userId ? mockRequests.filter(r => r.createdBy === userId) : mockRequests);
      setLoading(false);
    }, 1000);
  }, [userId]);

  const createRequest = async (requestData: {
    subject: string;
    message: string;
    requestType: 'New Development' | 'Data Change' | 'System Bug';
    priorityId: number;
    attachments: File[];
  }): Promise<Request> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: Request = {
          requestId: requests.length + 1,
          subject: requestData.subject,
          message: requestData.message,
          requestType: requestData.requestType,
          priorityId: requestData.priorityId,
          priority: mockPriorities.find(p => p.priorityId === requestData.priorityId)!,
          statusId: 1,
          status: mockStatuses[0],
          createdBy: 2, // Current user
          createdByUser: mockUsers[1],
          createdOn: new Date().toISOString(),
          mailCount: 0,
          lastActivity: new Date().toISOString()
        };
        
        setRequests(prev => [newRequest, ...prev]);
        resolve(newRequest);
      }, 1000);
    });
  };

  const updateRequestStatus = async (requestId: number, statusId: number, remark?: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setRequests(prev => prev.map(request => 
          request.requestId === requestId 
            ? { 
                ...request, 
                statusId, 
                status: mockStatuses.find(s => s.statusId === statusId)!,
                remark,
                updatedOn: new Date().toISOString() 
              }
            : request
        ));
        resolve();
      }, 500);
    });
  };

  const assignRequest = async (requestId: number, assignmentData: any): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setRequests(prev => prev.map(request => 
          request.requestId === requestId 
            ? { 
                ...request, 
                assignedTo: assignmentData.assignedTo,
                assignedToUser: mockUsers.find(u => u.userId === assignmentData.assignedTo),
                assignedOn: new Date().toISOString(),
                devTargetDate: assignmentData.devTargetDate,
                devRemark: assignmentData.devRemark,
                uatTargetDate: assignmentData.uatTargetDate,
                uatRemark: assignmentData.uatRemark,
                liveTargetDate: assignmentData.liveTargetDate,
                liveRemark: assignmentData.liveRemark,
                updatedOn: new Date().toISOString() 
              }
            : request
        ));
        resolve();
      }, 500);
    });
  };

  const getRequestMessages = (requestId: number): Mail[] => {
    return generateMockMails(requestId);
  };

  const getAllMails = (): Mail[] => {
    return generateAllMails();
  };

  const sendMail = async (mailData: any): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mail sent:', mailData);
        resolve();
      }, 1000);
    });
  };

  const toggleStar = async (mailId: number): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Toggled star for mail:', mailId);
        resolve();
      }, 500);
    });
  };

  const archiveMail = async (mailId: number): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Archived mail:', mailId);
        resolve();
      }, 500);
    });
  };

  const deleteMail = async (mailId: number): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Deleted mail:', mailId);
        resolve();
      }, 500);
    });
  };
  return {
    requests,
    loading,
    createRequest,
    updateRequestStatus,
    assignRequest,
    getRequestMessages,
    getAllMails,
    sendMail,
    toggleStar,
    archiveMail,
    deleteMail,
    priorities: mockPriorities,
    statuses: mockStatuses,
    users: mockUsers
  };
};