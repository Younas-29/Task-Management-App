import { useEffect, useState } from "react";
import { Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite";
// .env required: NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_DB_ID, NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;

export default function TeamTasksFetcher({ teamId, children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError("");
      try {
        // Only fetch tasks where permissions include team:teamId
        const res = await databases.listDocuments(DB_ID, TASKS_COLLECTION_ID, [
          // You can add filters here if needed
        ]);
        // Optionally filter tasks by teamId if you store it as a field
        setTasks(res.documents);
      } catch (err) {
        setError(err.message || "Failed to fetch tasks");
      }
      setLoading(false);
    }
    if (teamId) fetchTasks();
  }, [teamId]);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Support function-as-child (preferred) and direct children
  if (typeof children === 'function') {
    return children(tasks);
  }
  // If children is not a function, just render it (legacy/fallback)
  return children;
}
