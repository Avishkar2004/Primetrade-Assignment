import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api } from '../api/client';

const STATUS_OPTIONS = ['', 'todo', 'in_progress', 'done'];
const PRIORITY_OPTIONS = ['', 'low', 'medium', 'high'];
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [success, setSuccess] = useState('');

  const fetchTasks = (pageNum = page, limitNum = limit) => {
    setLoading(true);
    const params = { page: pageNum, limit: limitNum };
    if (search.trim()) params.search = search.trim();
    if (status) params.status = status;
    if (priority) params.priority = priority;
    api.tasks.list(params)
      .then((res) => {
        setTasks(res.data.tasks);
        setPagination(res.data.pagination || { page: 1, limit: limitNum, total: 0, totalPages: 1 });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks(page, limit);
  }, [page, limit, status, priority]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTasks(1, limit);
  };

  const handlePageChange = (newPage) => {
    const p = Math.max(1, Math.min(newPage, pagination.totalPages));
    setPage(p);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.tasks.delete(id);
      setSuccess('Task deleted.');
      fetchTasks(page, limit);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Link to="/dashboard/tasks/new" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">New task</Link>
      </div>
      {success && <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">{success}</div>}
      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title or description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-36">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p || 'All'}</option>)}
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900">Search</button>
        </form>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">No tasks found. Create one to get started.</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-sm text-gray-600">
              Showing {startItem}–{endItem} of {pagination.total} tasks
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Per page</label>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task._id} className="bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Link to={`/dashboard/tasks/${task._id}`} className="font-medium text-gray-900 hover:text-indigo-600">{task.title}</Link>
                  {task.description && <p className="text-sm text-gray-500 mt-0.5 truncate">{task.description}</p>}
                  <div className="flex gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">{task.status}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">{task.priority}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/dashboard/tasks/${task._id}/edit`} className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">Edit</Link>
                  <button type="button" onClick={() => handleDelete(task._id)} className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">Delete</button>
                </div>
              </li>
            ))}
          </ul>
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
