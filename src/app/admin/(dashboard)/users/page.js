"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Mail, 
  User, 
  Key,
  ShieldAlert
} from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  
  // List states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [formMode, setFormMode] = useState('list'); // 'list', 'edit', 'create'
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    email: '',
    role: 'editor',
    password: ''
  });
  
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        if (res.status === 403) {
          setError('Access forbidden: Only administrators can manage users.');
        } else {
          setError('Failed to fetch users. Ensure you are logged in as an admin.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred loading team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNew = () => {
    setFormData({
      id: '',
      username: '',
      email: '',
      role: 'editor',
      password: ''
    });
    setFormMode('create');
    setFormError('');
  };

  const handleEditUser = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'editor',
      password: '' // empty password by default when editing
    });
    setFormMode('edit');
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSaving(true);
    setFormError('');

    // Simple client side validation
    if (formMode === 'create' && !formData.password) {
      setFormError('Password is required for new accounts.');
      setFormSaving(false);
      return;
    }

    try {
      const url = '/api/admin/users';
      const method = formMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormMode('list');
        fetchUsers();
      } else {
        setFormError(data.error || 'Failed to save team member.');
      }
    } catch (err) {
      console.error(err);
      setFormError('An error occurred saving the user.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (parseInt(id, 10) === 1) {
      alert('The primary administrator account cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete the team member "${username}"? All articles written by this user will be removed or reassigned.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-850 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6.5 h-6.5 text-violet-500" />
            User Access Management
          </h1>
          <p className="text-xs text-gray-550 dark:text-gray-400 font-medium">
            {formMode === 'list' && 'Provision, update, and manage editor/admin accounts.'}
            {formMode === 'create' && 'Create a new console user account.'}
            {formMode === 'edit' && `Editing settings for: ${formData.username}`}
          </p>
        </div>
        
        {formMode === 'list' && !error && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {formMode === 'list' ? (
        /* ==================== LISTING VIEW ==================== */
        <div className="flex flex-col gap-4">
          {error ? (
            <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-650 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="glass-panel p-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <span className="text-xs text-gray-500">Loading user accounts...</span>
                </div>
              ) : users.length > 0 ? (
                <div className="glass-panel overflow-hidden border border-gray-200/80 dark:border-gray-850">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-950/40 text-gray-400 dark:text-gray-500 border-b border-gray-150 dark:border-gray-850 font-bold uppercase tracking-wider">
                          <th className="p-4">Username</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Date Added</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/10 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-650 flex items-center justify-center text-xs text-white font-extrabold shadow-sm select-none">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                                    {user.username}
                                    {user.id === 1 && (
                                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[8px] font-extrabold uppercase select-none">
                                        Primary Admin
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">UID: {user.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-650 dark:text-gray-300 font-medium">
                              {user.email}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                                user.role === 'admin' 
                                  ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20' 
                                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500 dark:text-gray-400 font-medium">
                              {formatDate(user.created_at)}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="p-1.5 bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 hover:border-violet-500 dark:hover:border-violet-400 text-gray-550 dark:text-gray-400 hover:text-violet-650 dark:hover:text-violet-450 rounded-lg transition-colors cursor-pointer"
                                  title="Edit account details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                {user.id !== 1 ? (
                                  <button
                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                    className="p-1.5 bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-400 text-gray-550 dark:text-gray-400 hover:text-red-650 dark:hover:text-red-450 rounded-lg transition-colors cursor-pointer"
                                    title="Delete account"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="p-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-850 text-gray-300 dark:text-gray-700 rounded-lg cursor-not-allowed"
                                    title="Primary administrator cannot be deleted"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-12 text-center flex flex-col items-center justify-center gap-3">
                  <Users className="w-12 h-12 text-gray-300 dark:text-gray-700 animate-pulse" />
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-base">No Users Found</h3>
                  <button
                    onClick={handleCreateNew}
                    className="mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Add User
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* ==================== CREATE / EDIT FORM VIEW ==================== */
        <form onSubmit={handleFormSubmit} className="glass-panel p-6 flex flex-col gap-5 relative animate-fade-up">
          {formError && (
            <div className="p-3.5 bg-red-500/5 border border-red-500/20 text-red-655 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form Actions Top */}
          <div className="flex justify-between items-center gap-3 border-b border-gray-150 dark:border-gray-850 pb-3">
            <button
              type="button"
              onClick={() => setFormMode('list')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Cancel and Return
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <User className="w-3 h-3 text-gray-400" />
                Username *
              </label>
              <input
                type="text"
                required
                name="username"
                disabled={formMode === 'edit'} // Username usually should be static after creation to prevent integrity issues
                placeholder="e.g. janesmith"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" />
                Email Address *
              </label>
              <input
                type="email"
                required
                name="email"
                placeholder="e.g. jane@ccbins.co"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
            </div>

            {/* Role Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-gray-400" />
                Access Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={formData.id === 1} // Primary admin role cannot be edited
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-850 text-gray-850 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="editor">Editor (Write/Edit Blogs)</option>
                <option value="admin">Administrator (Full Console Access)</option>
              </select>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Key className="w-3 h-3 text-gray-400" />
                Password {formMode === 'create' ? '*' : '(Leave empty to keep current)'}
              </label>
              <input
                type="password"
                required={formMode === 'create'}
                name="password"
                placeholder={formMode === 'create' ? "••••••••" : "Leave blank to keep current password"}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-950/40 border border-gray-255 dark:border-gray-850 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
            </div>

            {formData.id === 1 && (
              <div className="md:col-span-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-2 text-[10px] font-semibold text-amber-650 dark:text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  You are editing the Primary Administrator account. Its username and access role cannot be modified to prevent lockouts.
                </span>
              </div>
            )}
          </div>

          {/* Form Actions Bottom */}
          <div className="flex items-center gap-3 border-t border-gray-150 dark:border-gray-850 pt-5 mt-3">
            <button
              type="submit"
              disabled={formSaving}
              className="flex-grow py-3 px-5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {formSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save User Account
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setFormMode('list')}
              className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-650 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-850 rounded-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-800 text-center"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
