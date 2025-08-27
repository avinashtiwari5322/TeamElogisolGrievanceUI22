import React, { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Mail, Request, User as UserType } from '../../types';
import MailList from './MailList';
import MailView from './MailView';
import ComposeModal from './ComposeModal';

interface MessageThreadProps {
  mails: Mail[];
  currentUser: UserType;
  onSendMail: (mailData: any) => void;
  onStarToggle: (mailId: number) => void;
  onArchive: (mailId: number) => void;
  onDelete: (mailId: number) => void;
  selectedRequest?: Request | null;
  onBack?: () => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  mails,
  currentUser,
  onSendMail,
  onStarToggle,
  onArchive,
  onDelete,
  selectedRequest,
  onBack
}) => {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeMode, setComposeMode] = useState<'compose' | 'reply' | 'replyAll' | 'forward'>('compose');
  const [replyData, setReplyData] = useState<any>(null);

  const handleMailSelect = (mail: Mail) => {
    setSelectedMail(mail);
    // Mark as read if not already read
    if (!mail.isRead) {
      // This would typically trigger an API call to mark as read
    }
  };

  const handleCompose = () => {
    setComposeMode('compose');
    setReplyData(selectedRequest ? {
      requestId: selectedRequest.requestId,
      subject: `Re: ${selectedRequest.subject}`,
      toAddress: selectedRequest.createdByUser.email
    } : null);
    setShowCompose(true);
  };

  const handleReply = (mail: Mail) => {
    setComposeMode('reply');
    setReplyData({
      requestId: mail.requestId,
      subject: mail.subject.startsWith('Re:') ? mail.subject : `Re: ${mail.subject}`,
      toAddress: mail.fromAddress,
      originalBody: mail.body
    });
    setShowCompose(true);
  };

  const handleReplyAll = (mail: Mail) => {
    setComposeMode('replyAll');
    const allRecipients = [mail.fromAddress];
    if (mail.toAddresses) {
      allRecipients.push(...mail.toAddresses.split(',').map(addr => addr.trim()));
    }
    if (mail.ccAddresses) {
      allRecipients.push(...mail.ccAddresses.split(',').map(addr => addr.trim()));
    }
    
    setReplyData({
      requestId: mail.requestId,
      subject: mail.subject.startsWith('Re:') ? mail.subject : `Re: ${mail.subject}`,
      toAddress: allRecipients.filter(addr => addr !== currentUser.email).join(', '),
      originalBody: mail.body
    });
    setShowCompose(true);
  };

  const handleForward = (mail: Mail) => {
    setComposeMode('forward');
    setReplyData({
      requestId: mail.requestId,
      subject: mail.subject.startsWith('Fwd:') ? mail.subject : `Fwd: ${mail.subject}`,
      originalBody: mail.body
    });
    setShowCompose(true);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Request Header */}
      {selectedRequest && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div>
                <h3 className="font-semibold text-blue-900">Request #{selectedRequest.requestId}</h3>
                <p className="text-sm text-blue-700">{selectedRequest.subject}</p>
              </div>
            </div>
            <div className="text-right text-sm text-blue-600">
              <div>From: {selectedRequest.createdByUser.userName}</div>
              <div>Company: {selectedRequest.createdByUser.companyName || 'N/A'}</div>
              <div>Priority: {selectedRequest.priority.priorityName}</div>
              <div>Status: {selectedRequest.status.statusName}</div>
            </div>
          </div>
        </div>
      )}

      {/* Mail Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mail List */}
        <div className="w-1/3 min-w-0">
          <MailList
            mails={mails}
            selectedMailId={selectedMail?.mailId}
            onMailSelect={handleMailSelect}
            onStarToggle={onStarToggle}
          />
        </div>

        {/* Mail View */}
        <div className="flex-1 min-w-0">
          <MailView
            mail={selectedMail}
            onReply={handleReply}
            onReplyAll={handleReplyAll}
            onForward={handleForward}
            onStarToggle={onStarToggle}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        </div>
      </div>

      {/* Floating Compose Button */}
      <button
        onClick={handleCompose}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Compose new message"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        onSend={onSendMail}
        replyTo={replyData}
        mode={composeMode}
      />
    </div>
  );
};

export default MessageThread;