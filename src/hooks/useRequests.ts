// hooks/useRequests.ts
import { useState, useEffect } from 'react';
import { Request, Priority, Status, User, Mail } from '../types';

interface UseRequestsReturn {
  requests: Request[];
  loading: boolean;
  error: string | null;
  createRequest: (requestData: any) => Promise<void>;
  updateRequestStatus: (requestId: number, statusId: number, remark?: string) => Promise<void>;
  assignRequest: (requestId: number, assignmentData: any) => Promise<void>;
  getRequestMessages: (requestId: number) => Mail[];
  getAllMails: () => Mail[];
  sendMail: (messageData: any) => Promise<void>;
  toggleStar: (mailId: number) => Promise<void>;
  archiveMail: (mailId: number) => Promise<void>;
  deleteMail: (mailId: number) => Promise<void>;
  priorities: Priority[];
  statuses: Status[];
  users: User[];
}

export const useRequests = (userId?: number): UseRequestsReturn => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [mails, setMails] = useState<Mail[]>([]);

  // Mock data for priorities and statuses
  const mockPriorities: Priority[] = [
    { priorityId: 1, priorityName: 'High', isActive: true },
    { priorityId: 2, priorityName: 'Medium', isActive: true },
    { priorityId: 3, priorityName: 'Low', isActive: true },
  ];

  const mockStatuses: Status[] = [
    { statusId: 1, statusName: 'Pending', isActive: true },
    { statusId: 2, statusName: 'Active', isActive: true },
    { statusId: 3, statusName: 'Dev', isActive: true },
    { statusId: 4, statusName: 'Stag', isActive: true },
    { statusId: 5, statusName: 'Uat', isActive: true },
    { statusId: 6, statusName: 'Live', isActive: true },
    { statusId: 7, statusName: 'Closed', isActive: true },
  ];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/request-fetch/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId || 3, // Fallback to 3 if userId is undefined
          page: 1,
          pageSize: 10,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      if (data.success) {
        const transformedRequests: Request[] = data.requests.map((req: any) => ({
          requestId: req.RequestId,
          subject: req.Subject,
          message: req.Message,
          requestType: req.RequestType,
          remark: req.Remark || undefined,
          priorityId: req.PriorityId,
          priority: { priorityId: req.PriorityId, priorityName: req.Priority, isActive: true },
          statusId: req.StatusId,
          status: { statusId: req.StatusId, statusName: req.Status, isActive: true },
          createdBy: req.CreatedBy,
          createdByUser: {
            userId: req.CreatedBy,
            userName: req.CreatedBy,
            email: req.CreatedByEmail || '',
            role: 'User',
            roleId: req.CreatedByRoleId || 1,
            isActive: true,
          },
          createdOn: req.CreatedOn,
          updatedBy: req.UpdatedBy || undefined,
          updatedOn: req.UpdatedOn || undefined,
          assignedTo: req.AssignedTo || undefined,
          assignedToUser: req.AssignedTo
            ? {
                userId: req.AssignedTo,
                userName: req.AssignedTo,
                email: req.AssignedToEmail || '',
                role: 'User',
                roleId: req.AssignedToRoleId || 1,
                isActive: true,
              }
            : undefined,
          assignedOn: req.AssignedOn || undefined,
          devTargetDate: req.DevTargetDate || undefined,
          devRemark: req.DevRemark || undefined,
          uatTargetDate: req.UatTargetDate || undefined,
          uatRemark: req.UatRemark || undefined,
          liveTargetDate: req.LiveTargetDate || undefined,
          liveRemark: req.LiveRemark || undefined,
          attachments: req.Attachments || undefined,
          mailCount: req.mailCount || 0,
          lastActivity: req.LastActivity || undefined,
        }));
        setRequests(transformedRequests);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError('Error fetching requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const transformedUsers: User[] = data.users.map((u: any) => ({
        userId: u.userId,
        userName: u.userName,
        email: u.email,
        mobile: u.mobile || undefined,
        role: u.role || 'User',
        roleId: u.roleId || 1,
        companyId: u.companyId || undefined,
        companyName: u.companyName || undefined,
        passwordExpiryDate: u.passwordExpiryDate || undefined,
        company: u.company
          ? {
              companyId: u.company.companyId,
              companyName: u.company.companyName,
              companyEmail: u.company.companyEmail || undefined,
              address: u.company.address || undefined,
              mobile: u.company.mobile || undefined,
              isActive: u.company.isActive || true,
              delMark: u.company.delMark || undefined,
              createdBy: u.company.createdBy || undefined,
              createdOn: u.company.createdOn || undefined,
            }
          : undefined,
        isActive: u.isActive || true,
        delMark: u.delMark || undefined,
      }));
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchMails = async () => {
    try {
      const response = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/mails', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch mails');
      const data = await response.json();
      const transformedMails: Mail[] = data.mails.map((m: any) => ({
        mailId: m.mailId,
        requestId: m.requestId,
        parentMailId: m.parentMailId || undefined,
        subject: m.subject,
        body: m.body,
        fromAddress: m.fromAddress,
        toAddresses: m.toAddresses || undefined,
        ccAddresses: m.ccAddresses || undefined,
        sentOn: m.sentOn,
        isRead: m.isRead || false,
        isStarred: m.isStarred || false,
        hasAttachment: m.hasAttachment || false,
        attachments: m.attachments || undefined,
        replies: m.replies || undefined,
        createdBy: m.createdBy,
        createdByUser: {
          userId: m.createdBy,
          userName: m.createdByUserName || m.createdBy,
          email: m.createdByEmail || '',
          role: m.createdByRole || 'User',
          roleId: m.createdByRoleId || 1,
          isActive: true,
        },
      }));
      setMails(transformedMails);
    } catch (err) {
      console.error('Error fetching mails:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchUsers();
    fetchMails();
  }, [userId]);

  const createRequest = async (requestData: any) => {
    try {
      const response = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/request/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error('Failed to create request');
      await fetchRequests(); // Refresh requests
    } catch (err) {
      console.error('Error creating request:', err);
      throw err;
    }
  };

  const updateRequestStatus = async (requestId: number, statusId: number, remark?: string) => {
    try {
      const response = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/request/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, statusId, remark }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchRequests(); // Refresh requests
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  const assignRequest = async (requestId: number, assignmentData: any) => {
    try {
      const response = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/request/assign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, ...assignmentData }),
      });
      if (!response.ok) throw new Error('Failed to assign request');
      await fetchRequests(); // Refresh requests
    } catch (err) {
      console.error('Error assigning request:', err);
      throw err;
    }
  };

  const getRequestMessages = (requestId: number): Mail[] => {
    return mails.filter((mail) => mail.requestId === requestId);
  };

  const getAllMails = (): Mail[] => {
    return mails;
  };

  const sendMail = async (messageData: any) => {
    try {
      const response = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error('Failed to send mail');
      await fetchMails(); // Refresh mails
    } catch (err) {
      console.error('Error sending mail:', err);
      throw err;
    }
  };

  const toggleStar = async (mailId: number) => {
    try {
      const response = await fetch(`https://teamelogisolgrievanceapi.onrender.com/api/mail/${mailId}/star`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to toggle star');
      await fetchMails(); // Refresh mails
    } catch (err) {
      console.error('Error toggling star:', err);
      throw err;
    }
  };

  const archiveMail = async (mailId: number) => {
    try {
      const response = await fetch(`https://teamelogisolgrievanceapi.onrender.com/api/mail/${mailId}/archive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to archive mail');
      await fetchMails(); // Refresh mails
    } catch (err) {
      console.error('Error archiving mail:', err);
      throw err;
    }
  };

  const deleteMail = async (mailId: number) => {
    try {
      const response = await fetch(`https://teamelogisolgrievanceapi.onrender.com/api/mail/${mailId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete mail');
      await fetchMails(); // Refresh mails
    } catch (err) {
      console.error('Error deleting mail:', err);
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
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
    users,
  };
};