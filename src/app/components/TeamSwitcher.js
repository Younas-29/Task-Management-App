import { useEffect, useState } from "react";
import { Teams } from "appwrite";
import { client } from "@/lib/appwrite";
// .env required: NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_ENDPOINT
const teams = new Teams(client);

export default function TeamSwitcher({ onTeamSelect }) {
  const [teamsList, setTeamsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");

  useEffect(() => {
    async function fetchTeams() {
      setLoading(true);
      setError("");
      try {
        const res = await teams.list();
        setTeamsList(res.teams);
        if (res.teams.length > 0) {
          setSelected(res.teams[0].$id);
          if (onTeamSelect) onTeamSelect(res.teams[0].$id);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch teams");
      }
      setLoading(false);
    }
    fetchTeams();
  }, [onTeamSelect]);

  const handleChange = e => {
    setSelected(e.target.value);
    if (onTeamSelect) onTeamSelect(e.target.value);
  };

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mb-4">
      <label className="font-semibold mr-2">Select Team:</label>
      <select
        value={selected}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        {teamsList.map(team => (
          <option key={team.$id} value={team.$id}>{team.name}</option>
        ))}
      </select>
    </div>
  );
}
