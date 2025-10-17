import { useEffect, useState } from "react";
import { databases, ID } from "@/lib/appwrite";
import { Permission, Role } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const COMMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || "comments";

export default function CommentThread({ taskId, projectId, user, teamId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    let unsubscribe;
    async function fetchComments() {
      setLoading(true);
      setError("");
      try {
        const { Query } = await import("appwrite");
        let query = [];
        if (taskId) {
          query.push(Query.equal("task_id", taskId));
        } else if (projectId) {
          query.push(Query.equal("project_id", projectId));
        }
        const res = await databases.listDocuments(DB_ID, COMMENTS_COLLECTION_ID, query);
        setComments(res.documents);
      } catch (err) {
        setError(err.message || "Failed to fetch comments");
      }
      setLoading(false);
    }
    fetchComments();
    // Realtime subscription
    import("appwrite").then(({ Client }) => {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
      unsubscribe = client.subscribe(
        `databases.${DB_ID}.collections.${COMMENTS_COLLECTION_ID}.documents`,
        response => {
          const { events, payload } = response;
          if (taskId && payload.task_id !== taskId) return;
          if (!taskId && projectId && payload.project_id !== projectId) return;
          if (events.includes("databases.*.collections.*.documents.*.create")) {
            setComments(prev => [...prev, payload]);
          } else if (events.includes("databases.*.collections.*.documents.*.update")) {
            setComments(prev => prev.map(c => c.$id === payload.$id ? payload : c));
          } else if (events.includes("databases.*.collections.*.documents.*.delete")) {
            setComments(prev => prev.filter(c => c.$id !== payload.$id));
          }
        }
      );
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [taskId, projectId]);

  const handleAddComment = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    let permissions = teamId ? [
      Permission.read(Role.team(teamId)),
      Permission.write(Role.team(teamId)),
      Permission.update(Role.team(teamId)),
      Permission.delete(Role.team(teamId)),
    ] : [
      Permission.read(Role.user(user?.$id)),
      Permission.write(Role.user(user?.$id)),
      Permission.update(Role.user(user?.$id)),
      Permission.delete(Role.user(user?.$id)),
    ];
    try {
      await databases.createDocument(DB_ID, COMMENTS_COLLECTION_ID, ID.unique(), {
        text,
        task_id: taskId || null,
        project_id: projectId || null,
        created_by: user?.$id || "",
        created_at: new Date().toISOString(),
      }, permissions);
      setText("");
    } catch (err) {
      setError(err.message || "Failed to add comment");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4">
      <h3 className="text-lg font-bold text-indigo-700 mb-2">Comments</h3>
      {loading && <div className="text-gray-400">Loading comments...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="space-y-3 mb-4">
        {comments.length === 0 ? (
          <div className="text-gray-400">No comments yet.</div>
        ) : (
          comments.map(comment => (
            <div key={comment.$id} className="border-b pb-2 mb-2">
              <div className="text-sm text-gray-700">{comment.text}</div>
              <div className="text-xs text-gray-400">By {comment.created_by} • {new Date(comment.created_at).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded-lg p-2 flex-1"
          placeholder="Add a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={handleAddComment}
          disabled={loading || !text.trim()}
        >
          Post
        </button>
      </div>
    </div>
  );
}
