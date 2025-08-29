import React from 'react';
import { XCircle, User, Clock } from 'lucide-react';
import type { Request } from '../../types';
// interface Request {
//   RequestId: number;
//   Subject: string;
//   Message: string;
//   Remark: string | null;
//   PriorityId: number;
//   Priority: string;
//   StatusId: number;
//   Status: string;
//   IsActive: boolean;
//   DelMark: boolean;
//   CreatedBy: string;
//   CreatedOn: string;
//   UpdatedBy: string | null;
//   UpdatedOn: string | null;
//   RequestTypeId: number;
//   RequestType: string;
// }

interface RequestListContainerProps {
  requests: Request[];
  title: string;
  onRequestClick: (request: Request) => void;
}

const priorityIcons: Record<string, React.ComponentType<{ className: string }>> = {
  High: () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3L3 17h14L10 3z"/></svg>,
  Medium: () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7"/></svg>,
  Low: () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3h14v14H3z"/></svg>,
};

const priorityColors: Record<string, string> = {
  High: 'text-red-500',
  Medium: 'text-yellow-500',
  Low: 'text-green-500',
};

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Closed: 'bg-gray-100 text-gray-800',
};

const RequestListContainer: React.FC<RequestListContainerProps> = ({ requests, title, onRequestClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {requests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <XCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p>No requests found</p>
          </div>
        ) : (
          requests.map((request) => {
            const PriorityIcon = priorityIcons[request.PriorityName as keyof typeof priorityIcons] || priorityIcons['Low'];
            return (
              <div
                key={request.RequestId}
                onClick={() => onRequestClick(request)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <PriorityIcon 
                        className={`h-4 w-4 ${priorityColors[request.PriorityName as keyof typeof priorityIcons]}`} 
                      />
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {request.Subject}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {request.Message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{request.CreatedBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(request.CreatedOn).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[request.Status as keyof typeof statusColors]
                    }`}>
                      {request.Status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RequestListContainer;