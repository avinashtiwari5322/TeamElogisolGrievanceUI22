export interface User {
  userId: number;
  userName: string;
  email: string;
  mobile?: string;
  roleId: number;
  roleName: string;
  userType: 'Admin' | 'User' | 'Support';
  companyId?: number;
  companyName?: string;
  isActive: boolean;
}

export interface Company {
  companyId: number;
  companyName: string;
  email?: string;
  address?: string;
  mobile?: string;
  isActive: boolean;
}

export interface Priority {
  priorityId: number;
  priorityName: 'High' | 'Medium' | 'Low';
  isActive: boolean;
}

export interface Status {
  statusId: number;
  statusName: 'Pending' | 'Active' | 'Dev' | 'Stag' | 'Uat' | 'Live' | 'Closed';
  isActive: boolean;
}

export interface Request {
  requestId: number;
  subject: string;
  message: string;
  requestType: 'New Development' | 'Data Change' | 'System Bug';
  remark?: string;
  priorityId: number;
  priority: Priority;
  statusId: number;
  status: Status;
  createdBy: number;
  createdByUser: User;
  createdOn: string;
  updatedBy?: number;
  updatedOn?: string;
  assignedTo?: number;
  assignedToUser?: User;
  assignedOn?: string;
  devTargetDate?: string;
  devRemark?: string;
  uatTargetDate?: string;
  uatRemark?: string;
  liveTargetDate?: string;
  liveRemark?: string;
  attachments?: Attachment[];
  mailCount?: number;
  lastActivity?: string;
}

export interface Mail {
  mailId: number;
  requestId: number;
  parentMailId?: number;
  subject: string;
  body: string;
  fromAddress: string;
  toAddresses?: string;
  ccAddresses?: string;
  sentOn: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  attachments?: Attachment[];
  replies?: Mail[];
  createdBy: number;
  createdByUser: User;
}

export interface Attachment {
  attachmentId: number;
  requestId?: number;
  mailId?: number;
  fileName: string;
  filePath: string;
  fileSize?: number;
  contentType?: string;
  createdOn: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  activeRequests: number;
  closedRequests: number;
  highPriorityRequests: number;
  avgResolutionTime: number;
}