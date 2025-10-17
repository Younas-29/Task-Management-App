import { useState, useEffect } from "react";
// UPDATED: Using a relative path for Appwrite SDK functions
import { databases } from "@/lib/appwrite";
import CommentThread from "./CommentThread"; // Resolved: Component is now available

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;


export default function TaskDetailSidebar({ task, open, onClose, onTaskUpdated, onTaskDeleted, user }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const [assignee, setAssignee] = useState(task?.assignee || "");
  const [status, setStatus] = useState(task?.status || "todo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // NOTE: Swapping confirm() for a custom modal/alert message placeholder
  const showCustomModal = (message, onConfirm) => {
    console.warn(`[Custom Modal Placeholder] ${message}`);
    if (window.confirm(message)) { // Using window.confirm() as a placeholder that works in a browser context
      onConfirm();
    }
  };

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
      // Removed onClose() here, as user might want to continue editing or view changes
    } catch (err) {
      setError(err.message || "Failed to update task");
    }
    setLoading(false);
  };

  const handleDelete = () => {
    showCustomModal('Are you sure you want to delete this task? This action cannot be undone.', async () => {
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
    });
  };


  // Animation: Mount sidebar always, animate in/out
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) setMounted(true);
    else {
      // Wait for animation before unmount
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!mounted || !task) return null;

  const inputClass = "w-full border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg py-2 px-3 text-sm transition duration-150";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1 tracking-wider uppercase";

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-full md:max-w-md bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col font-sans
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'}
        md:rounded-none rounded-t-2xl md:top-0 top-0
      `}
      style={{ willChange: 'transform, opacity' }}
    >
  {/* HEADER: Title and Close Button */}
  <div className="flex justify-between items-center p-3 md:p-6 border-b sticky top-0 bg-white z-20 shadow-sm">
        <h2 className="text-xl font-extrabold text-gray-800 truncate">Task: {task.$id.substring(0, 8)}...</h2>
        <button
          className="text-gray-400 hover:text-indigo-600 text-2xl p-1 rounded-full transition"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

  {/* MAIN SCROLLABLE CONTENT: Task Details */}
  <div className="flex-1 overflow-y-auto p-2 md:p-6 space-y-6">
        {/* 1. TASK TITLE & DESCRIPTION */}
  <div className="space-y-3">
          <div className="mb-3">
            <label className={labelClass}>Title</label>
            <input
              type="text"
              className={`${inputClass} text-base font-semibold`}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} resize-y text-sm`}
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>
        </div>

        {/* 2. TASK METADATA (Grid Layout) */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 border-b pb-4 md:pb-6 border-gray-100">
            <div>
              <label className={labelClass}>Priority</label>
              <select
                className={inputClass}
                value={priority}
                onChange={e => setPriority(e.target.value)}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={status}
                onChange={e => setStatus(e.target.value)}
                disabled={loading}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                className={inputClass}
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className={labelClass}>Assignee</label>
              <input
                type="text"
                className={inputClass}
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                disabled={loading}
              />
            </div>
        </div>
        {/* Error Message */}
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">{error}</div>}

        {/* COMMENTS THREAD: Directly under fields */}
  <div className="mt-4 md:mt-6">
            <CommentThread
              taskId={task.$id}
              projectId={task.project_id}
              user={user}
              teamId={Array.isArray(task.$read)
                ? task.$read.find(r => r.startsWith('team:'))?.replace('team:', '')
                : undefined}
            />
        </div>
      </div>



  {/* FOOTER: Action Buttons (Sticky) */}
      <div className="flex gap-3 p-4 md:p-6 border-t justify-end sticky bottom-0 bg-white z-20 shadow-lg">
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition text-sm disabled:opacity-50"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium shadow-md hover:bg-red-600 transition text-sm disabled:opacity-50"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading && 'Deleting...' || 'Delete'}
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition text-sm disabled:opacity-50"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading && 'Saving...' || 'Save Changes'}
        </button>
      </div>

  {/* ...no comments section... */}
    </div>
  );
}
