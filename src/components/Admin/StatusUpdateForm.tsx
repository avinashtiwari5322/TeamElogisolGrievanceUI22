import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Request, Status } from '../../types';

interface StatusUpdateFormProps {
  request: Request;
  availableStatuses: Status[];
  onUpdate: (requestId: number, statusId: number, remark?: string) => void;
  onCancel: () => void;
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
  request,
  availableStatuses,
  onUpdate,
  onCancel
}) => {
  const [selectedStatusId, setSelectedStatusId] = useState(request.statusId);
  const [remark, setRemark] = useState(request.remark || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(request.requestId, selectedStatusId, remark);
  };

  const getStatusColor = (statusName: string): string => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Active: 'bg-blue-100 text-blue-800',
      Dev: 'bg-purple-100 text-purple-800',
      Stag: 'bg-indigo-100 text-indigo-800',
      Uat: 'bg-orange-100 text-orange-800',
      Live: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800'
    };
    return colors[statusName] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Update Request Status</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-2">{request.subject}</h4>
        <p className="text-sm text-gray-600">Request #{request.requestId}</p>
        <div className="mt-2">
          <span className="text-sm text-gray-500">Current Status: </span>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            getStatusColor(request.status.statusName)
          }`}>
            {request.status.statusName}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            New Status
          </label>
          <select
            id="status"
            value={selectedStatusId}
            onChange={(e) => setSelectedStatusId(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableStatuses.map((status) => (
              <option key={status.statusId} value={status.statusId}>
                {status.statusName}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Select the appropriate status for this request
          </p>
        </div>

        <div>
          <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-2">
            Admin Remarks
          </label>
          <textarea
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any remarks or updates for this request..."
          />
          <p className="mt-1 text-xs text-gray-500">
            This remark will be visible to the customer
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Update Status</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusUpdateForm;