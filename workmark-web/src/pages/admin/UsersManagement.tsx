import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserX, UserCheck, Trash2, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as adminApi from '../../api/admin';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

export default function UsersManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', { search, role: roleFilter, status: statusFilter }],
    queryFn: () => adminApi.getUsers({ search, role: roleFilter, status: statusFilter }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'active' | 'inactive' | 'suspended' }) =>
      adminApi.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: () => toast.error('Failed to update user status'),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const users = usersData?.data || [];

  return (
    <div className="min-h-screen bg-[#F7F7FB] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="clay-card-raised bg-white border border-white/80 rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link to="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-[#6C5CE7] hover:underline mb-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Hub</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">User Management</h1>
              <p className="text-xs sm:text-sm text-[#6C6A84] font-medium mt-1">
                Audit registered accounts, update role permissions, and handle suspensions.
              </p>
            </div>
            <div className="text-xs font-bold text-[#6C5CE7] bg-[#EDE9FE] px-3.5 py-1.5 rounded-xl border border-[#DDD6FE] self-start sm:self-auto">
              Total Accounts: {users.length}
            </div>
          </div>
        </div>

        {/* Filter Controls & Table Card */}
        <Card className="clay-card-raised bg-white border border-white/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                icon={<Search className="w-4 h-4 text-[#6C6A84]" />}
                className="rounded-2xl"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="clay-input rounded-2xl px-4 py-2.5 text-xs font-bold text-[#25243A] bg-white border border-[#E9E8F3] focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="clay-input rounded-2xl px-4 py-2.5 text-xs font-bold text-[#25243A] bg-white border border-[#E9E8F3] focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <Spinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<Users className="w-12 h-12 text-[#6C5CE7]" />}
                title="No Users Match Criteria"
                description="Try clearing or modifying the search filters."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E9E8F3] text-[11px] font-bold uppercase tracking-wider text-[#6C6A84]">
                    <th className="pb-3 px-4">User</th>
                    <th className="pb-3 px-4">Role</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Joined</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F0F8] text-xs font-medium">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#FAF9FE] transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#25243A] text-sm">{user.name}</div>
                        <div className="text-[#6C6A84] text-xs">{user.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EDE9FE] text-[#6C5CE7] border border-[#DDD6FE]">
                          {user.role === 'job_seeker' ? 'Job Seeker' : user.role === 'employer' ? 'Employer' : 'Admin'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            user.status === 'active'
                              ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                              : user.status === 'suspended'
                              ? 'bg-[#FFE4E6] text-[#E11D48] border-[#FECDD3]'
                              : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#6C6A84]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => updateStatusMutation.mutate({ userId: user._id, status: 'suspended' })}
                              className="p-2 rounded-xl bg-[#FEF3C7] text-[#D97706] hover:bg-[#FDE68A] transition-colors shadow-xs"
                              title="Suspend User"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatusMutation.mutate({ userId: user._id, status: 'active' })}
                              className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0] transition-colors shadow-xs"
                              title="Activate User"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to permanently delete this user?')) {
                                deleteUserMutation.mutate(user._id);
                              }
                            }}
                            className="p-2 rounded-xl bg-[#FFE4E6] text-[#E11D48] hover:bg-[#FECDD3] transition-colors shadow-xs"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
