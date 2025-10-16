import { useState } from "react";
import { Teams } from "appwrite";
import { client } from "@/lib/appwrite";
// .env required: NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_ENDPOINT
const teams = new Teams(client);

export default function TeamCreateModal({ onTeamCreated }) {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await teams.create("unique()", teamName);
      setOpen(false);
      setTeamName("");
      if (onTeamCreated) onTeamCreated(response);
    } catch (err) {
      setError(err.message || "Failed to create team");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        Create Team
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create a New Team</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              placeholder="Team Name"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
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
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleCreate}
                disabled={loading || !teamName}
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
