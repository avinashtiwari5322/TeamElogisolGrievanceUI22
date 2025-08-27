import React, { Component, ReactNode } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import StatsCard from '../Dashboard/StatsCard';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600 text-center p-4">Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

const AnalyticsPage: React.FC = () => {
  const { requests = [], loading } = useRequests(); // Default to empty array

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate analytics data with null checks
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status?.statusName === 'Pending').length;
  const activeRequests = requests.filter(r => r.status?.statusName === 'Active').length;
  const devRequests = requests.filter(r => r.status?.statusName === 'Dev').length;
  const uatRequests = requests.filter(r => r.status?.statusName === 'Uat').length;
  const liveRequests = requests.filter(r => r.status?.statusName === 'Live').length;
  const closedRequests = requests.filter(r => r.status?.statusName === 'Closed').length;

  // Request type breakdown
  const newDevelopmentRequests = requests.filter(r => r.requestType === 'New Development').length;
  const dataChangeRequests = requests.filter(r => r.requestType === 'Data Change').length;
  const systemBugRequests = requests.filter(r => r.requestType === 'System Bug').length;

  // Priority breakdown
  const highPriorityRequests = requests.filter(r => r.priority?.priorityName === 'High').length;
  const mediumPriorityRequests = requests.filter(r => r.priority?.priorityName === 'Medium').length;
  const lowPriorityRequests = requests.filter(r => r.priority?.priorityName === 'Low').length;

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentRequests = requests.filter(r => new Date(r.createdOn) >= sevenDaysAgo).length;

  const stats = [
    { title: 'Total Requests', value: totalRequests, icon: FileText, color: 'blue' as const },
    { title: 'Pending', value: pendingRequests, icon: Clock, color: 'yellow' as const },
    { title: 'Active', value: activeRequests, icon: TrendingUp, color: 'blue' as const },
    { title: 'In Development', value: devRequests, icon: BarChart3, color: 'purple' as const },
    { title: 'In UAT', value: uatRequests, icon: AlertTriangle, color: 'red' as const },
    { title: 'Live', value: liveRequests, icon: CheckCircle, color: 'green' as const },
    { title: 'Closed', value: closedRequests, icon: CheckCircle, color: 'gray' as const },
    { title: 'This Week', value: recentRequests, icon: Calendar, color: 'indigo' as const }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Overview of all requests and their current status</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <ErrorBoundary key={index}>
            <StatsCard
              title={stat.title || 'Unknown'} // Fallback
              value={stat.value ?? 0} // Fallback
              icon={stat.icon}
              color={stat.color || 'gray'} // Fallback
            />
          </ErrorBoundary>
        ))}
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Type Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-700">System Bug</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{systemBugRequests}</span>
                <span className="text-gray-500 text-sm">
                  ({totalRequests > 0 ? Math.round((systemBugRequests / totalRequests) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-700">New Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{newDevelopmentRequests}</span>
                <span className="text-gray-500 text-sm">
                  ({totalRequests > 0 ? Math.round((newDevelopmentRequests / totalRequests) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-gray-700">Data Change</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{dataChangeRequests}</span>
                <span className="text-gray-500 text-sm">
                  ({totalRequests > 0 ? Math.round((dataChangeRequests / totalRequests) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-gray-700">High Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{highPriorityRequests}</span>
                <span className="text-gray-500 text-sm">
                  ({totalRequests > 0 ? Math.round((highPriorityRequests / totalRequests) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Medium Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{mediumPriorityRequests}</span>
                <span className="text-gray-500 text-sm">
                  ({totalRequests > 0 ? Math.round((mediumPriorityRequests / totalRequests) * 100) : 0}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Low Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">{lowPriorityRequests}</span>
                <span className="text-gray-500 text-sm">
                  ({totalRequests > 0 ? Math.round((lowPriorityRequests / totalRequests) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Flow Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status Flow</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 mb-2">
              <div className="text-2xl font-bold">{pendingRequests}</div>
            </div>
            <div className="text-sm font-medium text-gray-700">Pending</div>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 rounded-lg p-4 mb-2">
              <div className="text-2xl font-bold">{activeRequests}</div>
            </div>
            <div className="text-sm font-medium text-gray-700">Active</div>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 text-purple-800 rounded-lg p-4 mb-2">
              <div className="text-2xl font-bold">{devRequests}</div>
            </div>
            <div className="text-sm font-medium text-gray-700">Development</div>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-800 rounded-lg p-4 mb-2">
              <div className="text-2xl font-bold">{requests.filter(r => r.status?.statusName === 'Stag').length}</div>
            </div>
            <div className="text-sm font-medium text-gray-700">Staging</div>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 text-orange-800 rounded-lg p-4 mb-2">
              <div className="text-2xl font-bold">{uatRequests}</div>
            </div>
            <div className="text-sm font-medium text-gray-700">UAT</div>
          </div>
          <div className="text-center">
            <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-2">
              <div className="text-2xl font-bold">{liveRequests}</div>
            </div>
            <div className="text-sm font-medium text-gray-700">Live</div>
          </div>
          <div className="text-center">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-4 mb-2">
              <div className="text-2xl font-bold">{closedRequests}</div>
            </div>
            <div className="text-sm font-medium text-gray-700">Closed</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests (Last 7 Days)</h3>
        {recentRequests > 0 ? (
          <div className="space-y-3">
            {requests
              .filter(r => new Date(r.createdOn) >= sevenDaysAgo)
              .slice(0, 5)
              .map((request) => (
                <div key={request.requestId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      request.requestType === 'System Bug' ? 'bg-red-500' :
                      request.requestType === 'New Development' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{request.subject || 'Untitled'}</div>
                      <div className="text-sm text-gray-500">
                        {request.requestType || 'Unknown'} • {request.createdByUser?.userName || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(request.createdOn).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No requests created in the last 7 days
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;