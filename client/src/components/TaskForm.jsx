import { useState } from 'react';

function TaskForm({ onSubmit, initialData = null, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'Medium');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ title, description, priority });
      if (!initialData) {
        setTitle('');
        setDescription('');
        setPriority('Medium');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-100 rounded-2xl p-4 space-y-3 bg-gray-50">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <div className="flex items-center gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-200 rounded-full px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white font-medium px-5 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {submitting ? 'Saving...' : initialData ? 'Update' : 'Add Task'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-700 px-2 text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;