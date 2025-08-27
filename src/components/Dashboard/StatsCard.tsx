import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray';
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const colorClasses = {
  blue: 'bg-blue-500 text-blue-600 bg-blue-50',
  green: 'bg-green-500 text-green-600 bg-green-50',
  yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
  red: 'bg-red-500 text-red-600 bg-red-50',
  purple: 'bg-purple-500 text-purple-600 bg-purple-50',
  indigo: 'bg-indigo-500 text-indigo-600 bg-indigo-50',
  gray: 'bg-gray-500 text-gray-600 bg-gray-50' // Added gray color class
};

const StatsCard: React.FC<StatsCardProps> = ({ title = 'N/A', value = 0, icon: Icon, color = 'gray', trend }) => {
  const colorClass = colorClasses[color] || colorClasses.gray; // Fallback to gray if color is invalid
  const [bgColor, textColor, cardBg] = colorClass.split(' ');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isUp ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${cardBg}`}>
          <Icon className={`h-8 w-8 ${textColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;