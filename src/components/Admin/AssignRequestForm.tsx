import React, { useState } from 'react';
import { Save, X, Calendar, User } from 'lucide-react';
import { Request, User as UserType } from '../../types';

interface AssignRequestFormProps {
  request: Request;
  availableUsers: UserType[];
  onAssign: (requestId: number, assignmentData: AssignmentData) => void;
  onCancel: () => void;
}

interface AssignmentData {
  assignedTo: number;
  devTargetDate?: string;
  devRemark?: string;
  uatTargetDate?: string;
  uatRemark?: string;
  liveTargetDate?: string;
  liveRemark?: string;
}

const AssignRequestForm: React.FC<AssignRequestFormProps> = ({
  request,
  availableUsers,
  onAssign,
  onCancel
}) => {
  const [formData, setFormData] = useState<AssignmentData>({
    assignedTo: request.assignedTo || 0,
    devTargetDate: request.devTargetDate || '',
    devRemark: request.devRemark || '',
    uatTargetDate: request.uatTargetDate || '',
    uatRemark: request.uatRemark || '',
    liveTargetDate: request.liveTargetDate || '',
    liveRemark: request.liveRemark || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(request.requestId, formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Assign Request</h3>
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
          <span className="text-sm text-gray-500">Request Type: </span>
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {request.requestType}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
            Assign to User *
          </label>
          <select
            id="assignedTo"
            required
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={0}>Select a user</option>
            {availableUsers.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.userName} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Development Phase */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Development Phase
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="devTargetDate" className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <input
                type="date"
                id="devTargetDate"
                value={formData.devTargetDate}
                onChange={(e) => setFormData({ ...formData, devTargetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="devRemark" className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                id="devRemark"
                rows={2}
                value={formData.devRemark}
                onChange={(e) => setFormData({ ...formData, devRemark: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Development phase remarks..."
              />
            </div>
          </div>
        </div>

        {/* UAT Phase */}
        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            UAT Phase
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="uatTargetDate" className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <input
                type="date"
                id="uatTargetDate"
                value={formData.uatTargetDate}
                onChange={(e) => setFormData({ ...formData, uatTargetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="uatRemark" className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                id="uatRemark"
                rows={2}
                value={formData.uatRemark}
                onChange={(e) => setFormData({ ...formData, uatRemark: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="UAT phase remarks..."
              />
            </div>
          </div>
        </div>

        {/* Live Phase */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Live Phase
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="liveTargetDate" className="block text-sm font-medium text-gray-700 mb-2">
                Target Date
              </label>
              <input
                type="date"
                id="liveTargetDate"
                value={formData.liveTargetDate}
                onChange={(e) => setFormData({ ...formData, liveTargetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="liveRemark" className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                id="liveRemark"
                rows={2}
                value={formData.liveRemark}
                onChange={(e) => setFormData({ ...formData, liveRemark: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Live phase remarks..."
              />
            </div>
          </div>
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
            <span>Assign Request</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignRequestForm;