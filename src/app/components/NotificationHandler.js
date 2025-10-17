import { useEffect, useState } from "react";
import { Client } from "appwrite";

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

export default function NotificationHandler({ user }) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!user) return;
    const client = new Client()
      .setEndpoint(ENDPOINT)
      .setProject(PROJECT_ID);
    // Listen for function execution events for this user
    const unsubscribe = client.subscribe(
      `functions.executions.user.${user.$id}`,
      response => {
        // Example payload: { event, payload: { message, type, ... } }
        const { payload } = response;
        if (payload && payload.message) {
          setNotifications(prev => [payload, ...prev].slice(0, 5));
        }
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n, idx) => (
        <div key={idx} className="bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-fade-in">
          <div className="font-bold">{n.type || "Notification"}</div>
          <div>{n.message}</div>
        </div>
      ))}
    </div>
  );
}
