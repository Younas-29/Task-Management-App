import { useState } from "react";
import { Teams } from "appwrite";
import { client } from "@/lib/appwrite";
// .env required: NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_ENDPOINT
const teams = new Teams(client);

export default function TeamInviteModal({ teamId, onInvited }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInvite = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await teams.createMembership(teamId, email, [role], window.location.origin);
      setOpen(false);
      setEmail("");
      setRole("member");
      if (onInvited) onInvited(response);
    } catch (err) {
      setError(err.message || "Failed to invite user");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        Invite User
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Invite User to Team</h2>
            <input
              type="email"
              className="border p-2 w-full mb-4"
              placeholder="User Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
            <select
              className="border p-2 w-full mb-4"
              value={role}
              onChange={e => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
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
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleInvite}
                disabled={loading || !email}
              >
                {loading ? "Inviting..." : "Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
