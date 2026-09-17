import React, { useState } from 'react';
import { Search, Shield, ShieldOff, Edit3, User, Globe, SlidersHorizontal, Check } from 'lucide-react';

export default function UserManagement({ users, setUsers }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Registered', 'Guest'
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');

  // Toggle user state Blocked/Active
  const handleToggleBlock = (userId) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'Blocked' ? 'Active' : 'Blocked' }
          : user
      )
    );
  };

  // Start editing user name
  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.name);
  };

  // Save edited user name
  const handleSaveEdit = (userId) => {
    if (!editName.trim()) return;
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, name: editName }
          : user
      )
    );
    setEditingUserId(null);
  };

  // Filter accounts based on query and type
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.status.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = 
      filterType === 'All' || 
      (filterType === 'Registered' && user.type === 'Registered') ||
      (filterType === 'Guest' && user.type === 'Guest');
      
    return matchesSearch && matchesType;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      
      {/* Filtering Actions Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-dark-border pb-6">
        <div>
          <h3 className="text-base font-bold text-white">Active Accounts Directory</h3>
          <p className="text-xs text-dark-muted">Search, edit, block, or isolate streaming sessions</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow md:flex-grow-0 md:w-72">
            <input
              type="text"
              placeholder="Search by name, status, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-dark-border text-xs text-white rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-brand transition-colors"
            />
            <Search className="absolute left-3 top-3 text-dark-muted" size={14} />
          </div>

          {/* Filter dropdown buttons */}
          <div className="flex bg-[#0a0a0c] p-1 rounded-xl border border-dark-border text-xs">
            {['All', 'Registered', 'Guest'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === type 
                    ? 'bg-brand text-white shadow-md glow-red' 
                    : 'text-dark-muted hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Data Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-dark-border text-[11px] text-dark-muted font-bold uppercase tracking-wider">
              <th className="py-4 px-4">User ID</th>
              <th className="py-4 px-4">Identity Details</th>
              <th className="py-4 px-4">Account Type</th>
              <th className="py-4 px-4">Joined Date</th>
              <th className="py-4 px-4">Watch Time</th>
              <th className="py-4 px-4">State</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-dark-border/40">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-[#121216]/30 transition-colors ${
                    user.status === 'Blocked' ? 'opacity-60 bg-red-950/5' : ''
                  }`}
                >
                  {/* User ID */}
                  <td className="py-4 px-4 font-mono text-dark-muted text-[10px]">
                    {user.id}
                  </td>

                  {/* Name & Account Details */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                        user.type === 'Registered' 
                          ? 'bg-brand/10 border-brand/20 text-brand' 
                          : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                      }`}>
                        {user.type === 'Registered' ? <User size={13} /> : <Globe size={13} />}
                      </div>

                      {/* Text details */}
                      <div>
                        {editingUserId === user.id ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <input 
                              type="text" 
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-dark-bg border border-dark-border text-white text-xs px-2 py-0.5 rounded outline-none focus:border-brand"
                            />
                            <button 
                              onClick={() => handleSaveEdit(user.id)}
                              className="p-1 bg-green-950/40 text-green-400 border border-green-500/20 rounded hover:bg-green-900/40 transition-colors"
                            >
                              <Check size={11} />
                            </button>
                          </div>
                        ) : (
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            <button 
                              onClick={() => handleStartEdit(user)}
                              className="opacity-0 group-hover:opacity-100 hover:text-brand text-dark-muted transition-opacity"
                              title="Edit user details"
                            >
                              {/* inline edit helper */}
                            </button>
                          </div>
                        )}
                        <p className="text-[10px] text-dark-muted font-mono mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Account Type Badge */}
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                      user.type === 'Registered' 
                        ? 'bg-brand/10 text-brand border-brand/20' 
                        : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'
                    }`}>
                      {user.type}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-4 text-dark-muted font-mono">
                    {user.joinDate}
                  </td>

                  {/* Total Watch Time */}
                  <td className="py-4 px-4 font-semibold text-gray-200">
                    {user.watchTime}
                  </td>

                  {/* Account state (Active/Blocked) */}
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'Active' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(user)}
                        className="p-1.5 hover:bg-[#121216] border border-dark-border/40 hover:border-dark-border text-dark-muted hover:text-white rounded-lg transition-all"
                        title="Edit Name"
                      >
                        <Edit3 size={12} />
                      </button>
                      
                      <button
                        onClick={() => handleToggleBlock(user.id)}
                        className={`p-1.5 border rounded-lg transition-all ${
                          user.status === 'Blocked' 
                            ? 'bg-green-950/20 border-green-500/30 text-green-400 hover:bg-green-900/30' 
                            : 'bg-red-950/20 border-red-500/30 text-red-400 hover:bg-red-900/30'
                        }`}
                        title={user.status === 'Blocked' ? 'Unblock Account' : 'Block Account'}
                      >
                        {user.status === 'Blocked' ? <Shield size={12} /> : <ShieldOff size={12} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-dark-muted">
                  No accounts found matching search guidelines.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center text-[10px] text-dark-muted font-medium pt-4 border-t border-dark-border/40">
        <span>Showing {filteredUsers.length} of {users.length} accounts</span>
        <span className="font-mono">Directory DB Sync: Active</span>
      </div>
    </div>
  );
}
