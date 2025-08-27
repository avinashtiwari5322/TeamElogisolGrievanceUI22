import React, { useState } from 'react';
import { 
  Reply, 
  ReplyAll, 
  Forward, 
  Star, 
  Archive, 
  Trash2, 
  Download, 
  Paperclip,
  User,
  Clock
} from 'lucide-react';
import { Mail as MailType } from '../../types';

interface MailViewProps {
  mail: MailType | null;
  onReply: (mail: MailType) => void;
  onReplyAll: (mail: MailType) => void;
  onForward: (mail: MailType) => void;
  onStarToggle: (mailId: number) => void;
  onArchive: (mailId: number) => void;
  onDelete: (mailId: number) => void;
}

const MailView: React.FC<MailViewProps> = ({
  mail,
  onReply,
  onReplyAll,
  onForward,
  onStarToggle,
  onArchive,
  onDelete
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!mail) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-gray-200 p-4 rounded-full inline-block mb-4">
            <div className="text-2xl">📧</div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No message selected</h3>
          <p className="text-gray-500">Choose a message from the list to view its contents</p>
        </div>
      </div>
    );
  }

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

  const parseAddresses = (addresses: string): string[] => {
    return addresses ? addresses.split(',').map(addr => addr.trim()) : [];
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Mail Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              {mail.subject}
            </h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Request #{mail.requestId}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStarToggle(mail.mailId)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              style={{ display: 'none' }}
            >
              <Star className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(mail.mailId)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onReply(mail)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </button>
          <button
            onClick={() => onReplyAll(mail)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ReplyAll className="h-4 w-4" />
            <span>Reply All</span>
          </button>
          <button
            onClick={() => onForward(mail)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Forward className="h-4 w-4" />
            <span>Forward</span>
          </button>
        </div>
      </div>

      {/* Mail Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Sender Info */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {mail.createdByUser.userName}
                </h3>
                <p className="text-sm text-gray-600">{mail.fromAddress}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDateTime(mail.sentOn)}
                </div>
                {!mail.isRead && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Unread
                  </span>
                )}
              </div>
            </div>

            {/* Recipients */}
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">To: </span>
              {parseAddresses(mail.toAddresses || '').join(', ') || 'No recipients'}
            </div>
            
            {mail.ccAddresses && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">CC: </span>
                {parseAddresses(mail.ccAddresses).join(', ')}
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>

            {showDetails && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="font-medium">From:</span> {mail.fromAddress}</div>
                  <div><span className="font-medium">Date:</span> {formatDateTime(mail.sentOn)}</div>
                  <div><span className="font-medium">Subject:</span> {mail.subject}</div>
                  <div><span className="font-medium">Request ID:</span> #{mail.requestId}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mail Body */}
        <div className="prose max-w-none mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {mail.body}
            </div>
          </div>
        </div>

        {/* Attachments */}
        {mail.attachments && mail.attachments.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Paperclip className="h-4 w-4 mr-2" />
              Attachments ({mail.attachments.length})
            </h4>
            <div className="space-y-2">
              {mail.attachments.map((attachment) => (
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
    </div>
  );
};

export default MailView;