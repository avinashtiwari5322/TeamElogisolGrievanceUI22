import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../hooks/useRequests';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import StatsCard from '../components/Dashboard/StatsCard';
import RequestsList from '../components/Dashboard/RequestsList';
import CreateRequestForm from '../components/Requests/CreateRequestForm';
import RequestDetailView from '../components/Requests/RequestDetailView';
import AssignRequestForm from '../components/Admin/AssignRequestForm';
import AnalyticsPage from '../components/Analytics/AnalyticsPage';
import MessageThread from '../components/Messages/MessageThread';
import StatusUpdateForm from '../components/Admin/StatusUpdateForm';
import type { Request } from '../types';
import RequestListContainer from '../components/Dashboard/RequestListContainer';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    requests: initialRequests, 
    loading, 
    createRequest, 
    updateRequestStatus, 
    assignRequest,
    getRequestMessages, 
    getAllMails,
    sendMail,
    toggleStar,
    archiveMail,
    deleteMail,
    priorities, 
    statuses,
    users
  } = useRequests(
    user?.role === 'User' ? user.userId : undefined
  );
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const isAdmin = user?.role === 'Admin';

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
        const userId = user.userId || null;
        const response = await fetch('http://localhost:4000/api/request-fetch/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId,
            page: 1,
            pageSize: 10,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }

        const data = await response.json();
        setRequests(data.requests || []); // Assuming the API returns { requests: Request[] }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const getFilteredRequests = (filter: string) => {
    switch (filter) {
      case 'pending':
        return requests.filter(r => r.Status === 'Pending');
      case 'active':
        return requests.filter(r => r.Status === 'Active');
      case 'closed':
        return requests.filter(r => r.Status === 'Closed');
      default:
        return requests;
    }
  };

  const handleCreateRequest = async (requestData: any) => {
    try {
      await createRequest(requestData);
      // Refresh requests after creating a new one
      const token = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const userId = user.userId || null;
      const response = await fetch('http://localhost:4000/api/request-fetch/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          page: 1,
          pageSize: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
      setActiveTab('my-requests');
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleStatusUpdate = async (requestId: number, statusId: number, remark?: string) => {
    try {
      await updateRequestStatus(requestId, statusId, remark);
      // Refresh requests after status update
      const response = await fetch('http://localhost:4000/api/request-fetch/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          page: 1,
          pageSize: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
      setShowStatusUpdate(false);
      setSelectedRequest(null);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignRequest = async (requestId: number, assignmentData: any) => {
    try {
      await assignRequest(requestId, assignmentData);
      // Refresh requests after assignment
      const response = await fetch('http://localhost:4000/api/request-fetch/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          page: 1,
          pageSize: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
      setShowAssignForm(false);
      setSelectedRequest(null);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Error assigning request:', error);
    }
  };

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setActiveTab('request-detail');
  };

  const handleSendMessage = async (messageData: any) => {
    try {
      await sendMail(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStarToggle = async (mailId: number) => {
    try {
      await toggleStar(mailId);
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleArchive = async (mailId: number) => {
    try {
      await archiveMail(mailId);
    } catch (error) {
      console.error('Error archiving mail:', error);
    }
  };

  const handleDelete = async (mailId: number) => {
    try {
      await deleteMail(mailId);
    } catch (error) {
      console.error('Error deleting mail:', error);
    }
  };

  // Listen for message icon click
  React.useEffect(() => {
    const handleOpenMessages = () => {
      setShowMessages(true);
    };

    window.addEventListener('openMessages', handleOpenMessages);
    return () => window.removeEventListener('openMessages', handleOpenMessages);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderDashboardStats = () => {
    const stats = isAdmin ? [
      { title: 'Total Requests', value: requests.length, icon: FileText, color: 'blue' as const },
      { title: 'Pending', value: requests.filter(r => r.Status === 'Pending').length, icon: Clock, color: 'yellow' as const },
      { title: 'Active', value: requests.filter(r => r.Status === 'Active').length, icon: TrendingUp, color: 'blue' as const },
      { title: 'Closed', value: requests.filter(r => r.Status === 'Closed').length, icon: CheckCircle, color: 'green' as const },
      { title: 'High Priority', value: requests.filter(r => r.PriorityName === 'High').length, icon: AlertTriangle, color: 'red' as const },
      { title: 'Active Users', value: 24, icon: Users, color: 'purple' as const }
    ] : [
      { title: 'My Requests', value: requests.length, icon: FileText, color: 'blue' as const },
      { title: 'Pending', value: requests.filter(r => r.Status === 'Pending').length, icon: Clock, color: 'yellow' as const },
      { title: 'In Progress', value: requests.filter(r => ['Active', 'Dev', 'Stag', 'Uat'].includes(r.Status!)).length, icon: TrendingUp, color: 'blue' as const },
      { title: 'Resolved', value: requests.filter(r => r.Status === 'Closed').length, icon: CheckCircle, color: 'green' as const }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            {renderDashboardStats()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RequestsList
                requests={requests.filter(r => r.StatusName === 'Pending').slice(0, 5)}
                title="Recent Pending Requests"
                onRequestClick={handleRequestClick}
              />
              <RequestsList
                requests={requests.filter(r => ['Active', 'Dev'].includes(r.StatusName!)).slice(0, 5)}
                title="Active Requests"
                onRequestClick={handleRequestClick}
              />
            </div>
          </div>
        );

      case 'my-requests':
      case 'all-requests':
        return (
          <RequestListContainer
            requests={requests}
            title={isAdmin ? "All Requests" : "My Requests"}
            onRequestClick={handleRequestClick}
          />
        );

      case 'pending':
        return (
          <RequestsList
            requests={getFilteredRequests('pending')}
            title="Pending Requests"
            onRequestClick={handleRequestClick}
          />
        );

      case 'active':
        return (
          <RequestsList
            requests={getFilteredRequests('active')}
            title="Active Requests"
            onRequestClick={handleRequestClick}
          />
        );

      case 'create-request':
        return (
          <CreateRequestForm
            onSubmit={handleCreateRequest}
            onCancel={() => setActiveTab('dashboard')}
          />
        );

      case 'analytics':
        return <AnalyticsPage />;

      case 'request-detail':
        if (!selectedRequest) return null;
        
        if (showStatusUpdate) {
          return (
            <StatusUpdateForm
              request={selectedRequest}
              availableStatuses={statuses}
              onUpdate={handleStatusUpdate}
              onCancel={() => setShowStatusUpdate(false)}
            />
          );
        }
        
        if (showAssignForm) {
          return (
            <AssignRequestForm
              request={selectedRequest}
              availableUsers={users.filter(u => u.role !== 'User')}
              onAssign={handleAssignRequest}
              onCancel={() => setShowAssignForm(false)}
            />
          );
        }
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Dashboard
              </button>
              {isAdmin && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAssignForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Assign Request
                  </button>
                  <button
                    onClick={() => setShowStatusUpdate(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              )}
            </div>
            
            <RequestDetailView
              request={selectedRequest}
              onBack={() => setActiveTab('dashboard')}
            />
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <p className="text-gray-600">This feature is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 relative">
          <div className="max-w-7xl mx-auto">
            {showMessages ? (
              <div className="h-[calc(100vh-120px)]">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                  <button
                    onClick={() => setShowMessages(false)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Back to Dashboard
                  </button>
                </div>
                <MessageThread
                  mails={getAllMails()}
                  currentUser={user!}
                  onSendMail={handleSendMessage}
                  onStarToggle={handleStarToggle}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                  onBack={() => setShowMessages(false)}
                />
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;