import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  User as UserIcon,
  MoreVertical,
  Filter,
  Eye,
  Edit2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { User, UserRole } from '../../types';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    StorageService.updateUserStatus(user.id, newStatus);
    setUsers(StorageService.getUsers());
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  const handleToggleRole = (user: User) => {
    const newRole: UserRole = user.role === 'admin' ? 'user' : 'admin';
    const updated = users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u));
    StorageService.saveUsers(updated);
    StorageService.addAdminLog({
      adminName: 'Admin',
      action: 'UPDATE',
      target: `User Role: ${user.name}`,
      details: `เปลี่ยนระดับสิทธิ์เป็น ${newRole}`
    });
    setUsers(updated);
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">จัดการสมาชิก (User Management)</h1>
        <p className="text-xs text-slate-400 mt-1">
          ตรวจสอบรายชื่อสมาชิก ควบคุมสถานะการใช้งาน และระดับสิทธิ์ (ไม่แสดงรหัสผ่านเพื่อความปลอดภัย)
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาด้วยชื่อ, อีเมล หรือ User ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">สถานะ:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            ทั้งหมด ({users.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            ใช้งานปกติ
          </button>
          <button
            onClick={() => setStatusFilter('disabled')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              statusFilter === 'disabled'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            ระงับการใช้งาน
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">สมาชิก</th>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">สิทธิ์</th>
                <th className="py-3 px-4">วันที่สมัคร</th>
                <th className="py-3 px-4">ใช้งานล่าสุด</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                        alt={user.name}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{user.id}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        user.role === 'admin'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {user.role === 'admin' ? '🛡️ Admin' : 'User'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{user.registeredAt}</td>
                  <td className="py-3 px-4 text-slate-400">{user.lastActive}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      {user.status === 'active' ? 'ปกติ (Active)' : 'ระงับการใช้งาน'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          user.status === 'active'
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                        }`}
                        title={user.status === 'active' ? 'ระงับบัญชี' : 'เปิดใช้งาน'}
                      >
                        {user.status === 'active' ? 'ระงับ' : 'ปลดแบน'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedUser.avatarUrl}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <h3 className="text-base font-bold">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="font-mono">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">บทบาท (Role):</span>
                <span className="font-bold text-indigo-400">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">สถานะ:</span>
                <span className={selectedUser.status === 'active' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">วันที่ลงทะเบียน:</span>
                <span>{selectedUser.registeredAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ชุดที่บันทึกไว้:</span>
                <span>{selectedUser.savedLookCount || 0} รายการ</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleToggleRole(selectedUser)}
                className="w-full py-2.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/50 text-xs font-bold transition-colors"
              >
                สลับสิทธิ์ผู้ใช้: {selectedUser.role === 'admin' ? 'ปรับเป็นสมาชิกทั่วไป' : 'แต่งตั้งเป็น Admin'}
              </button>

              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedUser.status === 'active'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                {selectedUser.status === 'active' ? 'ระงับบัญชีนี้' : 'เปิดใช้งานบัญชีนี้'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
