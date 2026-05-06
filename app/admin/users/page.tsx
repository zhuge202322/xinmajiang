'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Edit,
  Shield,
  MoreVertical,
  Mail,
  Trash2
} from 'lucide-react';

type User = {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  isAdmin: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdmin(userId: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isAdmin: !currentStatus }),
      });
      if (res.ok) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, isAdmin: !currentStatus } : u
        ));
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || 
      (roleFilter === 'admin' && user.isAdmin) ||
      (roleFilter === 'user' && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-500">管理注册用户</p>
        </div>
        <div className="text-sm text-gray-500">
          共 {users.length} 位用户
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">用户总数</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">管理员</p>
          <p className="text-2xl font-bold text-purple-700">{users.filter(u => u.isAdmin).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">普通用户</p>
          <p className="text-2xl font-bold text-gray-900">{users.filter(u => !u.isAdmin).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索邮箱或姓名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">全部角色</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">用户</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">邮箱</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">电话</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">角色</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">注册时间</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    没有找到用户
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-700 font-medium">
                            {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900">
                          {user.displayName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">{user.phone || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isAdmin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isAdmin ? '管理员' : '普通用户'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleAdmin(user.id, user.isAdmin)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isAdmin
                              ? 'text-purple-600 hover:bg-purple-50'
                              : 'text-gray-400 hover:bg-purple-50 hover:text-purple-600'
                          }`}
                          title={user.isAdmin ? '撤销管理员' : '设为管理员'}
                        >
                          <Shield size={18} />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          title="发送邮件"
                        >
                          <Mail size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
