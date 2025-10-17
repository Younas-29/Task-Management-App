// index.js for NotifyEvents Appwrite Function

const { Client, Users } = require("node-appwrite");

module.exports = async ({ req, res, log, error, env }) => {
  const eventType = req.headers["x-appwrite-event"];
  const payload = req.body;

  // Appwrite client setup
  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

  // Helper: send notification to user
  async function sendNotification(userId, type, message) {
    // This will trigger a function execution event for NotificationHandler
    // You can use Appwrite's messaging API for push/email if needed
    log(`Notify ${userId}: ${type} - ${message}`);
    // For demo: just log, but you can integrate messaging/email here
    // Optionally, use Appwrite Messaging API for push/email
  }

  // Task Created
  if (eventType.includes("tasks.documents.*.create")) {
    const assignees = payload.assignees || [];
    for (const userId of assignees) {
      await sendNotification(userId, "Task Assigned", `You have been assigned a new task: ${payload.title}`);
    }
  }
  // Task Updated (Assignment/Status Change)
  if (eventType.includes("tasks.documents.*.update")) {
    const assignees = payload.assignees || [];
    for (const userId of assignees) {
      await sendNotification(userId, "Task Updated", `Task updated: ${payload.title}`);
    }
  }
  // Task Deleted
  if (eventType.includes("tasks.documents.*.delete")) {
    const assignees = payload.assignees || [];
    for (const userId of assignees) {
      await sendNotification(userId, "Task Deleted", `Task deleted: ${payload.title}`);
    }
  }
  // New Comment
  if (eventType.includes("comments.documents.*.create")) {
    const targetUsers = payload.targetUsers || [];
    for (const userId of targetUsers) {
      await sendNotification(userId, "New Comment", `New comment: ${payload.text}`);
    }
  }

  res.json({ success: true });
};
