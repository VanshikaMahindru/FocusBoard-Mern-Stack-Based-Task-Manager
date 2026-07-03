import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';
import TaskForm from '../components/TaskForm';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (taskData) => {
    const newTask = await createTask(taskData);
    setTasks((prev) => [newTask, ...prev]);
    setShowForm(false);
  };

  const handleUpdate = async (id, taskData) => {
    const updated = await updateTask(id, taskData);
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleToggle = async (id) => {
    const updated = await toggleTask(id);
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  const priorityPill = {
    Low: 'bg-emerald-50 text-emerald-600',
    Medium: 'bg-amber-50 text-amber-600',
    High: 'bg-rose-50 text-rose-600',
  };

  const priorityRank = { High: 3, Medium: 2, Low: 1 };

  const filteredTasks = tasks
    .filter((t) => filterPriority === 'All' || t.priority === filterPriority)
    .filter((t) => {
      if (filterStatus === 'Active') return !t.completed;
      if (filterStatus === 'Completed') return t.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority-high') return priorityRank[b.priority] - priorityRank[a.priority];
      if (sortBy === 'priority-low') return priorityRank[a.priority] - priorityRank[b.priority];
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const activeCount = tasks.filter((t) => !t.completed).length;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <p className="text-gray-400 text-sm">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">Focus Board</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 mt-0.5">Task owner</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-rose-600 font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Your tasks</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {activeCount} active task{activeCount !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowForm((s) => !s)}
              className="bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition"
            >
              {showForm ? 'Close' : '+ Add new'}
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          {showForm && (
            <div className="mb-5">
              <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-5">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
            >
              <option value="All">All Tasks</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority-high">Priority: High to Low</option>
              <option value="priority-low">Priority: Low to High</option>
            </select>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">
              {tasks.length === 0 ? 'No tasks yet. Add your first one!' : 'No tasks match your filters.'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const { day, weekday } = formatDate(task.createdAt);
                return editingId === task._id ? (
                  <TaskForm
                    key={task._id}
                    initialData={task}
                    onSubmit={(data) => handleUpdate(task._id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div
                    key={task._id}
                    className={`border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow ${
                      task.completed ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="text-center w-10 shrink-0">
                      <p className="text-lg font-bold text-gray-800 leading-none">{day}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">{weekday}</p>
                    </div>

                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task._id)}
                      className="h-4 w-4 cursor-pointer accent-black shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-gray-900 truncate ${
                          task.completed ? 'line-through text-gray-400' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-gray-400 truncate mt-1">{task.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityPill[task.priority]}`}>
                        {task.priority}
                      </span>
                      <button
                        onClick={() => setEditingId(task._id)}
                        className="text-xs text-gray-400 hover:text-gray-900 font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-xs text-gray-400 hover:text-rose-600 font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;