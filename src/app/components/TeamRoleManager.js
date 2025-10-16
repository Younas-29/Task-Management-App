import { useState, useEffect } from "react";
import { Teams } from "appwrite";
import { client } from "@/lib/appwrite";
// .env required: NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_ENDPOINT
const teams = new Teams(client);

export default function TeamRoleManager({ teamId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError("");
      try {
        const res = await teams.listMemberships(teamId);
        setMembers(res.memberships);
      } catch (err) {
        setError(err.message || "Failed to fetch members");
      }
      setLoading(false);
    }
    fetchMembers();
  }, [teamId]);

  const handleRoleChange = async (membershipId, newRole) => {
    setLoading(true);
    setError("");
    try {
      await teams.updateMembershipRoles(teamId, membershipId, [newRole]);
      setMembers(members =>
        members.map(m =>
          m.$id === membershipId ? { ...m, roles: [newRole] } : m
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update role");
    }
    setLoading(false);
  };

  if (loading) return <div>Loading team members...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">Manage Team Roles</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.$id}>
              <td className="border px-2 py-1">{member.userName}</td>
              <td className="border px-2 py-1">{member.userEmail}</td>
              <td className="border px-2 py-1">{member.roles.join(", ")}</td>
              <td className="border px-2 py-1">
                <select
                  value={member.roles[0]}
                  onChange={e => handleRoleChange(member.$id, e.target.value)}
                  disabled={loading}
                  className="border p-1"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
