export interface User {
  userId: number;
  userName: string;
  email: string;
  mobile?: string;
  role?: string;
  roleId: number;
  companyId?: number;
  companyName?: string;
  passwordExpiryDate?: string;
  company?: Company;
  isActive: boolean;
  delMark?: boolean;
}

export interface Company {
  companyId: number;
  companyName: string;
  companyEmail?: string;
  address?: string;
  mobile?: string;
  isActive: boolean;
  delMark?: boolean;
  createdBy?: number;
  createdOn?: string;
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

// export interface Request {
//   requestId: number;
//   subject: string;
//   message: string;
//   requestType: string;
//   remark?: string;
//   priorityId: number;
//   priority: Priority;
//   statusId: number;
//   status: Status;
//   createdBy: number;
//   createdByUser: User;
//   createdOn: string;
//   updatedBy?: number;
//   updatedOn?: string;
//   assignedTo?: number;
//   assignedToUser?: User;
//   assignedOn?: string;
//   devTargetDate?: string;
//   devRemark?: string;
//   uatTargetDate?: string;
//   uatRemark?: string;
//   liveTargetDate?: string;
//   liveRemark?: string;
//   attachments?: Attachment[];
//   mailCount?: number;
//   lastActivity?: string;
// }
export interface Request {
RequestId: number;
  Subject: string;
  Message: string;
  Remark: string | null;
  PriorityId: number;
  PriorityName: string;
  mailCount?: number;
  StatusId?: number;
  Status?: string;
  StatusName?: string;
  IsActive: boolean;
  DelMark: boolean;
  CreatedBy: number;
  CreatedByUserName: string;
  CreatedOn: string;
  UpdatedBy: string | null;
  UpdatedOn: string | null;
  RequestTypeId: number;
  RequestType: string;
  attachments?: { AttachmentId: number; FileName: string; FilePath: string }[];
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