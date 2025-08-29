import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Send, Paperclip, X, Upload } from 'lucide-react';

interface CreateRequestFormProps {
  onSubmit: (requestData: CreateRequestData) => void;
  onCancel?: () => void;
}

interface CreateRequestData {
  subject: string;
  message: string;
  requestType: string
  priorityId: number;
  attachments: File[];
}

const CreateRequestForm: React.FC<CreateRequestFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    requestType: '',
    priorityId: 0
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [priorities, setPriorities] = useState<{ id: number; name: string }[]>([]);
  const [requestTypes, setRequestTypes] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('https://teamelogisolgrievanceapi.onrender.com/api/master/priority-list', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.priorities)) {
          setPriorities(data.priorities);
          if (data.priorities.length > 0) {
            setFormData(f => ({ ...f, priorityId: data.priorities[0].id }));
          }
        }
      });

    fetch('https://teamelogisolgrievanceapi.onrender.com/api/master/request-type-list', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.requestTypes)) {
          setRequestTypes(data.requestTypes);
          if (data.requestTypes.length > 0) {
            setFormData(f => ({ ...f, requestType: data.requestTypes[0].name as any }));
          }
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert attachments to base64
    const filesBase64 = await Promise.all(
      attachments.map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              base64: (reader.result as string).split(',')[1] // remove data:*/*;base64,
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    // Find requestTypeId from requestTypes
    const selectedRequestType = requestTypes.find(rt => rt.name === formData.requestType);
    const requestTypeId = selectedRequestType ? selectedRequestType.id : null;

    // Get userId from localStorage
    let userId = null;
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      userId = user.userId || null;
    } catch {}

    const payload = {
      subject: formData.subject,
      message: formData.message,
      requestType: formData.requestType,
      requestTypeId,
      priorityId: formData.priorityId,
      userId,
      attachments: filesBase64
    };

    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch('https://teamelogisolgrievanceapi.onrender.com/api/request/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Request saved successfully!');
      } else {
        toast.error(result.message || 'Failed to save request');
      }
    } catch (err) {
      toast.error('Error saving request');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create New Request</h2>
        <p className="text-gray-600 text-sm mt-1">
          Submit your complaint, feature request, or improvement suggestion
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-2">
            Request Type *
          </label>
          <select
            id="requestType"
            required
            value={formData.requestType}
            onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {requestTypes.map(rt => (
              <option key={rt.id} value={rt.name}>{rt.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of your request"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priorityId}
            onChange={(e) => setFormData({ ...formData, priorityId: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Provide detailed information about your request..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or{' '}
              <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                browse
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">
              PDF, DOC, XLS, images up to 10MB each
            </p>
          </div>

          {/* Attached Files List */}
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Paperclip className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Submit Request</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequestForm;