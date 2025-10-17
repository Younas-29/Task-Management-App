import { useEffect, useState } from "react";
// UPDATED: Using a relative path for Appwrite SDK functions
import { databases, ID } from "@/lib/appwrite";
import { Permission, Role, Query } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const COMMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || "comments";

// Utility function to make user IDs friendlier
const formatUserId = (userId) => {
    if (!userId) return "Unknown User";
    if (userId.length < 8) return userId;
    return `${userId.substring(0, 4)}...${userId.substring(userId.length - 4)}`;
};

// Utility function for relative time display
const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + " years ago";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " months ago";
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " days ago";
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " hours ago";
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minutes ago";
    return Math.floor(seconds) <= 0 ? "just now" : Math.floor(seconds) + " seconds ago";
};

// Simple Avatar Component (using Tailwind/lucide-react style)
const Avatar = ({ userId }) => (
    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
        {userId ? userId[0].toUpperCase() : '?'}
    </div>
);

export default function CommentThread({ taskId, projectId, user, teamId }) {
  // For swipe/drag detection
  const [swipedComment, setSwipedComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Handle swipe/drag events (desktop & mobile)
  const handleSwipe = (direction, comment) => {
    if (direction === "left") {
      setSwipedComment(comment.$id);
      setEditContent(comment.content);
    } else if (direction === "right") {
      setDeleteTarget(comment);
      setShowDeleteConfirm(true);
    }
  };

  const handleEditComment = async (comment) => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      await databases.updateDocument(DB_ID, COMMENTS_COLLECTION_ID, comment.$id, { content: editContent });
      setSwipedComment(null);
    } catch (err) {
      setError(err.message || "Failed to edit comment");
    }
    setLoading(false);
  };

  const handleDeleteComment = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await databases.deleteDocument(DB_ID, COMMENTS_COLLECTION_ID, deleteTarget.$id);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Failed to delete comment");
    }
    setLoading(false);
  };
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    let unsubscribe;
    const fetchComments = async () => {
      setLoading(true);
      setError("");
      try {
        const { Client } = await import("appwrite"); 
        
        let query = [Query.orderDesc('$createdAt')]; // Order by newest first
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
    };
    
    fetchComments();
    
    // Realtime subscription setup
    import("appwrite").then(({ Client }) => {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

      const targetChannel = `databases.${DB_ID}.collections.${COMMENTS_COLLECTION_ID}.documents`;
      
      unsubscribe = client.subscribe(targetChannel, response => {
        const { events, payload } = response;
        
        // Filter events not relevant to this task/project
        if (taskId && payload.task_id !== taskId) return;
        if (!taskId && projectId && payload.project_id !== projectId) return;

        setComments(prev => {
          if (events.includes("databases.*.collections.*.documents.*.create")) {
            // Add new comment to the top of the list
            if (prev.some(c => c.$id === payload.$id)) return prev;
            return [payload, ...prev]; 
          } else if (events.includes("databases.*.collections.*.documents.*.update")) {
            return prev.map(c => c.$id === payload.$id ? payload : c);
          } else if (events.includes("databases.*.collections.*.documents.*.delete")) {
            return prev.filter(c => c.$id !== payload.$id);
          }
          return prev;
        });
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [taskId, projectId]);

  const handleAddComment = async () => {
    if (!text.trim()) return;
    setIsPosting(true);
    setError("");

    // Setup permissions for individual user only (Appwrite requirement)
    let permissions = [
      Permission.read(Role.any()),
      Permission.write(Role.any()),
      Permission.delete(Role.any()),
      Permission.update(Role.any()),
    ];
    
    try {
      await databases.createDocument(DB_ID, COMMENTS_COLLECTION_ID, ID.unique(), {
        content: text,
        task_id: taskId || null,
        project_id: projectId, // Always include project_id
        user_id: user?.$id || "anonymous", // Fallback
      }, permissions);
      setText("");
    } catch (err) {
      setError(err.message || "Failed to add comment");
    }
    setIsPosting(false);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base md:text-lg font-bold text-gray-800 border-b pb-2">Activity ({comments.length})</h3>

      {/* Comment Input */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-end w-full">
        <textarea
          className="border border-gray-300 rounded-xl p-2 sm:p-3 flex-1 resize-y text-sm focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[40px] sm:min-h-[48px]"
          placeholder="Add a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isPosting}
          rows={2}
        />
        <button
          className="bg-indigo-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-sm shadow-md hover:bg-indigo-700 transition disabled:opacity-50 flex-shrink-0 w-full sm:w-auto"
          onClick={handleAddComment}
          disabled={isPosting || !text.trim()}
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>
      
      {loading && <div className="text-gray-400 text-center py-3">Fetching comments...</div>}
      {error && <div className="text-red-500 text-sm text-center p-2 bg-red-50 border border-red-100 rounded-lg">{error}</div>}

      {/* Comments List */}
      <div className="space-y-4 pt-1">
        {!loading && comments.length === 0 ? (
          <div className="text-gray-400 text-center p-3 bg-gray-50 rounded-lg">No comments yet. Start the conversation!</div>
        ) : (
          comments.map(comment => {
            // Swipe/drag logic: mouse/touch events
            let startX = null;
            let threshold = 60; // px
            return (
              <div
                key={comment.$id}
                className="flex gap-2 sm:gap-3 items-start group"
                onMouseDown={e => { startX = e.clientX; }}
                onMouseUp={e => {
                  if (startX !== null) {
                    let diff = e.clientX - startX;
                    if (diff < -threshold) handleSwipe("left", comment);
                    if (diff > threshold) handleSwipe("right", comment);
                    startX = null;
                  }
                }}
                onTouchStart={e => { startX = e.touches[0].clientX; }}
                onTouchEnd={e => {
                  if (startX !== null) {
                    let diff = e.changedTouches[0].clientX - startX;
                    if (diff < -threshold) handleSwipe("left", comment);
                    if (diff > threshold) handleSwipe("right", comment);
                    startX = null;
                  }
                }}
              >
                <Avatar userId={comment.user_id} />
                <div className="flex-1 bg-gray-50 p-2 sm:p-3 rounded-xl shadow-sm border border-gray-100 relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-xs sm:text-sm text-gray-800">
                      {formatUserId(comment.user_id)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {timeAgo(comment.$createdAt)}
                    </span>
                  </div>
                  {swipedComment === comment.$id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        className="border border-indigo-300 rounded-lg p-2 text-sm w-full"
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        disabled={loading}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                          onClick={() => handleEditComment(comment)}
                          disabled={loading || !editContent.trim()}
                        >Save</button>
                        <button
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold"
                          onClick={() => setSwipedComment(null)}
                          disabled={loading}
                        >Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  )}
                  {deleteTarget && deleteTarget.$id === comment.$id && showDeleteConfirm && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-10">
                      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 text-center">
                        <div className="mb-2 text-sm font-semibold text-gray-800">Are you sure you want to delete this comment?</div>
                        <div className="flex gap-2 justify-center mt-2">
                          <button
                            className="bg-red-600 text-white px-4 py-1 rounded-lg text-xs font-semibold"
                            onClick={handleDeleteComment}
                            disabled={loading}
                          >Delete</button>
                          <button
                            className="bg-gray-200 text-gray-700 px-4 py-1 rounded-lg text-xs font-semibold"
                            onClick={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
                            disabled={loading}
                          >Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
