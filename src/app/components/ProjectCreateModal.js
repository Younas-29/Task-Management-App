import { useState } from "react";
import { databases } from "@/lib/appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const PROJECTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID;

export default function ProjectCreateModal({ onProjectCreated, user }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      // Use authenticated user's ID for created_by
      const response = await databases.createDocument(DB_ID, PROJECTS_COLLECTION_ID, "unique()", {
        name,
        description,
        team_id: teamId ? teamId : null,
        created_by: user?.$id || "",
      });
      setOpen(false);
      setDescription("");
      if (onProjectCreated) onProjectCreated(response);
    } catch (err) {
      let errorMsg = "Failed to create project";
      if (err && err.message) errorMsg = err.message;
      if (err && err.response && err.response.message) errorMsg += ": " + err.response.message;
      setError(errorMsg);
      console.error("Project creation error:", err);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 hover:shadow-lg transition-all font-semibold"
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5"/></svg>
          Create Project
        </span>
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
            <h2 className="text-2xl font-extrabold mb-4 text-green-700 text-center">Create a New Project</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 mb-2"
                placeholder="Project Name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 mb-2 resize-none"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
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
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold shadow hover:scale-105 hover:shadow-lg transition-all"
                onClick={handleCreate}
                disabled={loading || !name}
              >
                {loading ? (
                  <span className="flex items-center gap-2"><svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4"/></svg> Creating...</span>
                ) : (
                  <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5"/></svg> Create</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
    );
  
  }
