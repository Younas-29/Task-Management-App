
# TaskFlow – Multi-Tenant Task Management App

TaskFlow is a modern, full-stack task management application built with Next.js, Appwrite, and Tailwind CSS. It supports multi-tenant teams, project-centric workflows, Kanban boards, real-time collaboration, and robust authentication.

## 🚀 Features

- **Multi-Tenant Teams:** Create and manage multiple teams, invite users, assign roles, and collaborate securely.
- **Project Management:** Create projects within teams, view all projects you own or are a member of.
- **Kanban Board:** Drag-and-drop tasks across customizable columns (To Do, In Progress, Done).
- **Task Management:** Create, edit, assign, and prioritize tasks with due dates and assignees.
- **Real-Time Updates:** Live task updates using Appwrite subscriptions (coming soon).
- **Comments & Activity Feed:** Comment on tasks and view project activity (coming soon).
- **Team Management:** Manage team members, roles, and invitations from the project page.
- **Analytics & Charts:** Visualize project progress and statistics (coming soon).
- **Authentication:** Secure login, registration, and session management with Appwrite Auth.

## 🏗️ Tech Stack

- [Next.js 14](https://nextjs.org/)
- [Appwrite MCP](https://appwrite.io/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (Kanban drag-and-drop)

## 📦 Getting Started

### 1. Clone the Repository

```
git clone <your-repo-url>
cd starter-for-nextjs
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Appwrite

Create a `.env` file in the root and add your Appwrite credentials:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=your-appwrite-endpoint
NEXT_PUBLIC_APPWRITE_PROJECT=your-appwrite-project-id
NEXT_PUBLIC_APPWRITE_DATABASE=your-appwrite-database-id
```

Set up Appwrite collections for teams, projects, and tasks as described in `/src/lib/appwrite.js`.

### 4. Run the Development Server

```
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## 📝 Usage

- Register or log in to your account.
- Create or join a team.
- Create projects within your team.
- Add, edit, and move tasks on the Kanban board.
- Manage team members and roles.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch and open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📚 Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

_Built with ❤️ by Younas-29 and contributors._