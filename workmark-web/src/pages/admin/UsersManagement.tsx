import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserX, UserCheck, Trash2 } from 'lucide-react';
import * as adminApi from '../../api/admin';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0F2747] mb-8">User Management</h1>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">All Roles</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-[#64748B]">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-[#64748B]">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Joined</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-4 font-medium text-[#172033]">{user.name}</td>
                      <td className="px-4 py-4 text-[#64748B]">{user.email}</td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#64748B]">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => updateStatusMutation.mutate({ userId: user._id, status: 'suspended' })}
                              className="text-orange-600 hover:text-orange-700"
                              title="Suspend"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatusMutation.mutate({ userId: user._id, status: 'active' })}
                              className="text-green-600 hover:text-green-700"
                              title="Activate"
                            >
                              <UserCheck className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this user?')) {
                                deleteUserMutation.mutate(user._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
