import { useState } from "react";
import { Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;

export default function TaskCreateModal({ teamId, onTaskCreated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const permissions = [
        Permission.read(Role.team(teamId)),
        Permission.update(Role.team(teamId)),
        Permission.delete(Role.team(teamId)),
        Permission.write(Role.team(teamId)),
        Permission.write(Role.users()), // Allow all users to create/write
      ];
      const response = await databases.createDocument(DB_ID, TASKS_COLLECTION_ID, "unique()", {
        title,
        description,
        status,
        priority,
        due_date: dueDate,
        project_id: projectId,
        assignee,
        created_by: createdBy,
      }, permissions);
      setOpen(false);
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setDueDate("");
      setAssignee("");
      setProject("");
      if (onTaskCreated) onTaskCreated(response);
    } catch (err) {
      setError(err.message || "Failed to create task");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        Add Task
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create a New Task</h2>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading}
            />
            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={loading}
            />
            <select
              className="border p-2 w-full mb-2"
              value={status}
              onChange={e => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              className="border p-2 w-full mb-2"
              value={priority}
              onChange={e => setPriority(e.target.value)}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Project ID"
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Assignee"
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Created By"
              value={createdBy}
              onChange={e => setCreatedBy(e.target.value)}
              disabled={loading}
            />
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
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
