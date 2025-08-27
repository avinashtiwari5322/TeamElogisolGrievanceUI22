import React from 'react';
import { Clock, User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Request } from '../../types';

interface RequestsListProps {
  requests: Request[];
  title: string;
  onRequestClick: (request: Request) => void;
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Active: 'bg-blue-100 text-blue-800',
  Dev: 'bg-purple-100 text-purple-800',
  Stag: 'bg-indigo-100 text-indigo-800',
  Uat: 'bg-orange-100 text-orange-800',
  Live: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-800'
};

const priorityIcons = {
  High: AlertTriangle,
  Medium: Clock,
  Low: CheckCircle
};

const priorityColors = {
  High: 'text-red-500',
  Medium: 'text-yellow-500',
  Low: 'text-green-500'
};

const RequestsList: React.FC<RequestsListProps> = ({ requests, title, onRequestClick }) => {
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
            const PriorityIcon = priorityIcons[request.priority.priorityName];
            return (
              <div
                key={request.requestId}
                onClick={() => onRequestClick(request)}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <PriorityIcon 
                        className={`h-4 w-4 ${priorityColors[request.priority.priorityName]}`} 
                      />
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {request.subject}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {request.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{request.createdByUser.userName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(request.createdOn).toLocaleDateString()}</span>
                      </div>
                      {request.mailCount && request.mailCount > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {request.mailCount} messages
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[request.status.statusName]
                    }`}>
                      {request.status.statusName}
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

export default RequestsList;