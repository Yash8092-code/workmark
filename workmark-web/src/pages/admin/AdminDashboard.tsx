import { useQuery } from '@tanstack/react-query';
import { Users, Briefcase, FileText, Building2, TrendingUp, ShieldCheck, Activity } from 'lucide-react';
import * as adminApi from '../../api/admin';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  });

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, bg: 'bg-[#EDE9FE]', text: 'text-[#6C5CE7]', border: 'border-[#DDD6FE]' },
    { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase, bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', border: 'border-[#BBF7D0]' },
    { label: 'Total Applications', value: stats?.totalApplications || 0, icon: FileText, bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]', border: 'border-[#BAE6FD]' },
    { label: 'Total Companies', value: stats?.totalCompanies || 0, icon: Building2, bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', border: 'border-[#FDE68A]' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="clay-card-raised bg-white border border-white/80 rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#6C5CE7] text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>System Administration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">Platform Command Center</h1>
              <p className="text-xs sm:text-sm text-[#6C6A84] font-medium mt-1">
                Real-time metrics, user management, and platform health telemetry.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A] bg-[#DCFCE7] border border-[#BBF7D0] px-3 py-1.5 rounded-xl self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-6 clay-card-raised bg-white border border-white/80 rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6C6A84] mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-[#25243A]">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.text} ${stat.border} border flex items-center justify-center shadow-xs`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Activity & Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 sm:p-8 clay-card-raised bg-white border border-white/80 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[#25243A] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#6C5CE7]" />
                <span>30-Day Growth Telemetry</span>
              </h2>
              <span className="text-xs font-bold text-[#6C6A84] bg-[#FAF9FE] px-2.5 py-1 rounded-lg border border-[#E9E8F3]">Live Data</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-[#FAF9FE] border border-[#E9E8F3]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#25243A]">New User Registrations</span>
                    <p className="text-[11px] text-[#6C6A84]">Seekers & Employers</p>
                  </div>
                </div>
                <span className="text-lg font-black text-[#6C5CE7]">{stats?.recentActivity?.newUsers || 0}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-[#FAF9FE] border border-[#E9E8F3]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#25243A]">New Job Listings</span>
                    <p className="text-[11px] text-[#6C6A84]">Active Openings Posted</p>
                  </div>
                </div>
                <span className="text-lg font-black text-[#16A34A]">{stats?.recentActivity?.newJobs || 0}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-[#FAF9FE] border border-[#E9E8F3]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#25243A]">Applications Submitted</span>
                    <p className="text-[11px] text-[#6C6A84]">Candidate Pipeline Activity</p>
                  </div>
                </div>
                <span className="text-lg font-black text-[#0284C7]">{stats?.recentActivity?.newApplications || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 clay-card-raised bg-white border border-white/80 rounded-3xl">
            <h2 className="text-lg font-black text-[#25243A] mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#6C5CE7]" />
              <span>Admin Quick Actions</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="/admin/users"
                className="p-4 rounded-2xl bg-[#FAF9FE] hover:bg-white border border-[#E9E8F3] hover:border-[#6C5CE7]/40 shadow-xs hover:shadow-md transition-all group block"
              >
                <Users className="w-6 h-6 text-[#6C5CE7] mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm text-[#25243A]">Manage Users</h3>
                <p className="text-xs text-[#6C6A84] mt-1">Review accounts, roles, and access suspensions.</p>
              </a>

              <a
                href="/admin/companies"
                className="p-4 rounded-2xl bg-[#FAF9FE] hover:bg-white border border-[#E9E8F3] hover:border-[#6C5CE7]/40 shadow-xs hover:shadow-md transition-all group block"
              >
                <Building2 className="w-6 h-6 text-[#6C5CE7] mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm text-[#25243A]">Verify Companies</h3>
                <p className="text-xs text-[#6C6A84] mt-1">Approve or audit organization employer profiles.</p>
              </a>

              <a
                href="/admin/jobs"
                className="p-4 rounded-2xl bg-[#FAF9FE] hover:bg-white border border-[#E9E8F3] hover:border-[#6C5CE7]/40 shadow-xs hover:shadow-md transition-all group block"
              >
                <Briefcase className="w-6 h-6 text-[#6C5CE7] mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm text-[#25243A]">Audit Jobs</h3>
                <p className="text-xs text-[#6C6A84] mt-1">Monitor active openings and compliance standards.</p>
              </a>

              <a
                href="/admin/reports"
                className="p-4 rounded-2xl bg-[#FAF9FE] hover:bg-white border border-[#E9E8F3] hover:border-[#6C5CE7]/40 shadow-xs hover:shadow-md transition-all group block"
              >
                <FileText className="w-6 h-6 text-[#6C5CE7] mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm text-[#25243A]">Flagged Reports</h3>
                <p className="text-xs text-[#6C6A84] mt-1">Resolve flagged listings and user concerns.</p>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
