import React from 'react';
import { Calendar, User, Building, AlertTriangle, Clock, CheckCircle, FileText, Paperclip, Download } from 'lucide-react';
import { Request } from '../../types';

interface RequestDetailViewProps {
  request: Request;
  onBack: () => void;
}

const RequestDetailView: React.FC<RequestDetailViewProps> = ({ request, onBack }) => {
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (statusName: string): string => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Active: 'bg-blue-100 text-blue-800 border-blue-200',
      Dev: 'bg-purple-100 text-purple-800 border-purple-200',
      Stag: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Uat: 'bg-orange-100 text-orange-800 border-orange-200',
      Live: 'bg-green-100 text-green-800 border-green-200',
      Closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[statusName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priorityName: string): string => {
    const colors: Record<string, string> = {
      High: 'text-red-600 bg-red-50 border-red-200',
      Medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      Low: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[priorityName] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getRequestTypeColor = (requestType: string): string => {
    const colors: Record<string, string> = {
      'New Development': 'text-blue-600 bg-blue-50 border-blue-200',
      'Data Change': 'text-orange-600 bg-orange-50 border-orange-200',
      'System Bug': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[requestType] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Requests
          </button>
          <span className="text-sm text-gray-500">Request #{request.requestId}</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{request.subject}</h1>
        
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
            getStatusColor(request.status.statusName)
          }`}>
            {request.status.statusName}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
            getPriorityColor(request.priority.priorityName)
          }`}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            {request.priority.priorityName} Priority
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
            getRequestTypeColor(request.requestType)
          }`}>
            <FileText className="h-4 w-4 mr-1" />
            {request.requestType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {request.message}
                </p>
              </div>
            </div>

            {/* Admin Remarks */}
            {request.remark && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Remarks</h3>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-800">{request.remark}</p>
                </div>
              </div>
            )}

            {/* Assignment Details */}
            {request.assignedToUser && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment Details</h3>
                <div className="bg-green-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Assigned to:</span>
                    <span className="font-medium text-gray-900">{request.assignedToUser.userName}</span>
                  </div>
                  {request.assignedOn && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Assigned on:</span>
                      <span className="font-medium text-gray-900">{formatDateTime(request.assignedOn)}</span>
                    </div>
                  )}
                  
                  {/* Target Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {request.devTargetDate && (
                      <div className="bg-white rounded p-3 border border-green-200">
                        <div className="text-xs font-medium text-gray-500 uppercase">Development</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {new Date(request.devTargetDate).toLocaleDateString()}
                        </div>
                        {request.devRemark && (
                          <div className="text-xs text-gray-600 mt-1">{request.devRemark}</div>
                        )}
                      </div>
                    )}
                    {request.uatTargetDate && (
                      <div className="bg-white rounded p-3 border border-green-200">
                        <div className="text-xs font-medium text-gray-500 uppercase">UAT</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {new Date(request.uatTargetDate).toLocaleDateString()}
                        </div>
                        {request.uatRemark && (
                          <div className="text-xs text-gray-600 mt-1">{request.uatRemark}</div>
                        )}
                      </div>
                    )}
                    {request.liveTargetDate && (
                      <div className="bg-white rounded p-3 border border-green-200">
                        <div className="text-xs font-medium text-gray-500 uppercase">Live</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {new Date(request.liveTargetDate).toLocaleDateString()}
                        </div>
                        {request.liveRemark && (
                          <div className="text-xs text-gray-600 mt-1">{request.liveRemark}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Attachments */}
            {request.attachments && request.attachments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>
                <div className="space-y-2">
                  {request.attachments.map((attachment) => (
                    <div
                      key={attachment.attachmentId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.fileName}
                          </p>
                          {attachment.fileSize && (
                            <p className="text-xs text-gray-500">
                              {(attachment.fileSize / 1024).toFixed(1)} KB
                            </p>
                          )}
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Request Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Created by:</span>
                  <span className="font-medium text-gray-900">{request.createdByUser.userName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium text-gray-900">{request.createdByUser.companyName || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">{formatDateTime(request.createdOn)}</span>
                </div>
                {request.updatedOn && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Last updated:</span>
                    <span className="font-medium text-gray-900">{formatDateTime(request.updatedOn)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Activity Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Request Created</div>
                    <div className="text-gray-500">{formatDateTime(request.createdOn)}</div>
                  </div>
                </div>
                {request.assignedOn && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Request Assigned</div>
                      <div className="text-gray-500">{formatDateTime(request.assignedOn)}</div>
                    </div>
                  </div>
                )}
                {request.updatedOn && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Status Updated</div>
                      <div className="text-gray-500">{formatDateTime(request.updatedOn)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailView;