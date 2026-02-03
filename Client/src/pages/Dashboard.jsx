import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasksCount, setTasksCount] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    Promise.all([api.me.get(), api.tasks.list({ limit: 1 })])
      .then(([meRes, tasksRes]) => {
        setProfile(meRes.data.user);
        setTasksCount(tasksRes.data.pagination ? tasksRes.data.pagination.total : 0);
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const u = profile || user;
    if (u) {
      setEditName(u.name || '');
      setEditEmail(u.email || '');
    }
  }, [profile, user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      </Layout>
    );
  }

  const displayUser = profile || user;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    setProfileSaving(true);
    try {
      const res = await api.me.update({ name: editName.trim(), email: editEmail.trim() });
      setProfile(res.data.user);
      setProfileMessage({ type: 'success', text: 'Profile updated.' });
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Profile</h2>
          <p className="mt-2 text-lg font-medium text-gray-900">{displayUser.name}</p>
          <p className="text-sm text-gray-600">{displayUser.email}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tasks</h2>
          <p className="mt-2 text-2xl font-bold text-indigo-600">{tasksCount}</p>
          <Link to="/dashboard/tasks" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Edit profile</h2>
        {profileMessage.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {profileMessage.text}
          </div>
        )}
        <form onSubmit={handleUpdateProfile} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={profileSaving}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {profileSaving ? 'Saving…' : 'Update profile'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
