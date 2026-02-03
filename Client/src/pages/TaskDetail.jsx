import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api } from '../api/client';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.tasks
      .get(id)
      .then((res) => setTask(res.data.task))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (error || !task) {
    return (
      <Layout>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error || 'Task not found'}</div>
        <Link to="/dashboard/tasks" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to tasks
        </Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4">
        <Link to="/dashboard/tasks" className="text-indigo-600 hover:underline text-sm">
          ← Back to tasks
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <Link
            to={`/dashboard/tasks/${task._id}/edit`}
            className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
          >
            Edit
          </Link>
        </div>
        {task.description && (
          <p className="mt-4 text-gray-600 whitespace-pre-wrap">{task.description}</p>
        )}
        <div className="mt-4 flex gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {task.status}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {task.priority}
          </span>
        </div>
      </div>
    </Layout>
  );
}
