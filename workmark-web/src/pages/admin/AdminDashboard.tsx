import { useQuery } from '@tanstack/react-query';
import { Users, Briefcase, FileText, Building2 } from 'lucide-react';
import * as adminApi from '../../api/admin';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  });

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: 'bg-green-500' },
    { label: 'Total Applications', value: stats?.totalApplications || 0, icon: FileText, color: 'bg-purple-500' },
    { label: 'Total Companies', value: stats?.totalCompanies || 0, icon: Building2, color: 'bg-orange-500' },
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0F2747] mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-[#E2E8F0] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#64748B] text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#0F2747]">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <h2 className="text-xl font-bold text-[#0F2747] mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0]">
              <span className="text-[#172033]">New Users (Last 30 days)</span>
              <span className="font-bold text-[#2563EB]">{stats?.recentActivity?.newUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0]">
              <span className="text-[#172033]">New Jobs (Last 30 days)</span>
              <span className="font-bold text-[#16A34A]">{stats?.recentActivity?.newJobs || 0}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[#172033]">New Applications (Last 30 days)</span>
              <span className="font-bold text-[#9333EA]">{stats?.recentActivity?.newApplications || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
