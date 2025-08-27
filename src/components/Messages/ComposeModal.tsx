import React, { useState } from 'react';
import { X, Send, Paperclip, Upload } from 'lucide-react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (mailData: ComposeMailData) => void;
  replyTo?: {
    requestId: number;
    subject: string;
    toAddress: string;
    originalBody?: string;
  };
  mode: 'compose' | 'reply' | 'replyAll' | 'forward';
}

interface ComposeMailData {
  requestId?: number;
  subject: string;
  body: string;
  toAddresses: string;
  ccAddresses?: string;
  bccAddresses?: string;
  attachments: File[];
}

const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  onSend,
  replyTo,
  mode
}) => {
  const [formData, setFormData] = useState({
    subject: replyTo ? `Re: ${replyTo.subject}` : '',
    body: '',
    toAddresses: replyTo?.toAddress || '',
    ccAddresses: '',
    bccAddresses: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({
      requestId: replyTo?.requestId,
      ...formData,
      attachments
    });
    onClose();
    // Reset form
    setFormData({
      subject: '',
      body: '',
      toAddresses: '',
      ccAddresses: '',
      bccAddresses: ''
    });
    setAttachments([]);
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

  const getModalTitle = () => {
    switch (mode) {
      case 'reply': return 'Reply';
      case 'replyAll': return 'Reply All';
      case 'forward': return 'Forward';
      default: return 'Compose Message';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-4 space-y-4 border-b border-gray-200">
            {/* To Field */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 w-12">To:</label>
              <input
                type="email"
                required
                value={formData.toAddresses}
                onChange={(e) => setFormData({ ...formData, toAddresses: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="recipient@example.com"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCc(!showCc)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Cc
                </button>
                <button
                  type="button"
                  onClick={() => setShowBcc(!showBcc)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Bcc
                </button>
              </div>
            </div>

            {/* CC Field */}
            {showCc && (
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 w-12">Cc:</label>
                <input
                  type="email"
                  value={formData.ccAddresses}
                  onChange={(e) => setFormData({ ...formData, ccAddresses: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="cc@example.com"
                />
              </div>
            )}

            {/* BCC Field */}
            {showBcc && (
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 w-12">Bcc:</label>
                <input
                  type="email"
                  value={formData.bccAddresses}
                  onChange={(e) => setFormData({ ...formData, bccAddresses: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="bcc@example.com"
                />
              </div>
            )}

            {/* Subject Field */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 w-12">Subject:</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter subject"
              />
            </div>
          </div>

          {/* Message Body */}
          <div className="flex-1 p-4">
            <textarea
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Type your message here..."
            />

            {/* Original Message (for replies/forwards) */}
            {replyTo?.originalBody && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Original message:</p>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {replyTo.originalBody}
                </div>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="p-4 border-t border-gray-200">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
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

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer text-gray-500 hover:text-gray-700">
                <Paperclip className="h-5 w-5" />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                  className="hidden"
                />
              </label>
              {attachments.length > 0 && (
                <span className="text-sm text-gray-600">
                  {attachments.length} file(s) attached
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeModal;