import { useState } from "react";
import { databases, ID } from "@/lib/appwrite";
import { Permission, Role } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;

export default function TaskCreateModal({ projectId, user, onTaskCreated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      // Get teamId from project (assume projectId is available, fetch project if needed)
      let teamId = null;
      if (typeof window !== "undefined" && projectId) {
        try {
          const projectDoc = await databases.getDocument(DB_ID, process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID, projectId);
          teamId = projectDoc.team_id;
        } catch (err) {
          console.error('Error fetching project for teamId:', err);
        }
      }
      const permissions = teamId ? [
        Permission.read(Role.team(teamId)),
        Permission.update(Role.team(teamId)),
        Permission.delete(Role.team(teamId)),
        Permission.write(Role.team(teamId)),
      ] : [
        Permission.read(Role.user(user?.$id)),
        Permission.update(Role.user(user?.$id)),
        Permission.delete(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ];
      try {
        response = await databases.createDocument(DB_ID, TASKS_COLLECTION_ID, ID.unique(), {
          title,
          description,
          status: "todo",
          priority,
          due_date: dueDate,
          project_id: projectId,
          assignee,
          created_by: user?.$id || "",
        }, permissions);
      } catch (err) {
        // Debug log for error
        console.error('Task creation error:', err);
        setError(err.message || "Failed to create task");
        setLoading(false);
        return;
      }
      setOpen(false);
      setTitle("");
      setDescription("");
  setPriority("medium");
  setDueDate("");
  setAssignee("");
      if (onTaskCreated) onTaskCreated(response);
    } catch (err) {
      setError(err.message || "Failed to create task");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
        onClick={() => setOpen(true)}
      >
        + Add Task
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setOpen(false)}
              disabled={loading}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-extrabold mb-4 text-indigo-700 text-center">Create a New Task</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                placeholder="Task Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2 resize-none"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
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
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee (User ID or Email)</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                placeholder="Assignee"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <div className="text-red-500 mb-2 text-sm text-center">{error}</div>}
            <div className="flex gap-3 justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition-all"
                onClick={handleCreate}
                disabled={loading || !title}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
