import { useState } from "react";
import { databases } from "@/lib/appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;

export default function TaskDetailSidebar({ task, open, onClose, onTaskUpdated, onTaskDeleted }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const [assignee, setAssignee] = useState(task?.assignee || "");
  const [status, setStatus] = useState(task?.status || "todo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const updated = await databases.updateDocument(DB_ID, TASKS_COLLECTION_ID, task.$id, {
        title,
        description,
        priority,
        due_date: dueDate,
        assignee,
        status,
      });
      if (onTaskUpdated) onTaskUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update task");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await databases.deleteDocument(DB_ID, TASKS_COLLECTION_ID, task.$id);
      if (onTaskDeleted) onTaskDeleted(task.$id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
    setLoading(false);
  };

  if (!open || !task) return null;

  return (
  <div className="fixed top-0 right-0 h-full w-full md:max-w-md bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col md:rounded-none rounded-t-2xl transition-all duration-300 overflow-y-auto">
      <div className="flex justify-between items-center p-4 md:p-6 border-b sticky top-0 bg-white z-10">
        <h2 className="text-lg md:text-2xl font-bold text-indigo-700">Edit Task</h2>
        <button className="text-gray-400 hover:text-gray-700 text-3xl md:text-2xl" onClick={onClose}>&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-4 md:p-3 w-full mb-2 text-base"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="border border-gray-300 rounded-lg p-4 md:p-3 w-full mb-2 resize-none text-base"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            className="border border-gray-300 rounded-lg p-4 md:p-3 w-full mb-2 text-base"
            value={priority}
            onChange={e => setPriority(e.target.value)}
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg p-4 md:p-3 w-full mb-2 text-base"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-4 md:p-3 w-full mb-2 text-base"
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="border border-gray-300 rounded-lg p-4 md:p-3 w-full mb-2 text-base"
            value={status}
            onChange={e => setStatus(e.target.value)}
            disabled={loading}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        {error && <div className="text-red-500 mb-2 text-sm text-center">{error}</div>}
      </div>
      <div className="flex gap-3 p-4 md:p-6 border-t justify-end sticky bottom-0 bg-white z-10">
        <button
          className="px-6 py-3 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition text-base"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="px-6 py-3 md:px-4 md:py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition-all text-base"
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </button>
        <button
          className="px-6 py-3 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition-all text-base"
          onClick={handleUpdate}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </div>
  );
}
