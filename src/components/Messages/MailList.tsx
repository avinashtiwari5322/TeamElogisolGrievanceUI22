import React from 'react';
import { Mail, Paperclip, Star, Clock, User } from 'lucide-react';
import { Mail as MailType } from '../../types';

interface MailListProps {
  mails: MailType[];
  selectedMailId?: number;
  onMailSelect: (mail: MailType) => void;
  onStarToggle: (mailId: number) => void;
}

const MailList: React.FC<MailListProps> = ({ 
  mails, 
  selectedMailId, 
  onMailSelect, 
  onStarToggle 
}) => {
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500">{mails.length} conversations</p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {mails.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          mails.map((mail) => (
            <div
              key={mail.mailId}
              onClick={() => onMailSelect(mail)}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedMailId === mail.mailId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              } ${!mail.isRead ? 'bg-blue-25' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${!mail.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {mail.createdByUser.userName}
                      </span>
                      {!mail.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatDateTime(mail.sentOn)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-1">
                    <span className={`text-sm ${!mail.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {truncateText(mail.subject, 50)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {truncateText(mail.body, 80)}
                    </p>
                    <div className="flex items-center space-x-1 ml-2">
                      {mail.hasAttachment && (
                        <Paperclip className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-400">
                        #{mail.requestId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MailList;