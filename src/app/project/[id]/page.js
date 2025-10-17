'use client';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useRouter, useParams } from 'next/navigation';
import { account, databases } from '@/lib/appwrite';
import { Permission, Role } from 'appwrite';
import Sidebar from '../../components/Sidebar';
import TaskCreateModal from '../../components/TaskCreateModal';
import TaskDetailSidebar from '../../components/TaskDetailSidebar';
import TeamCreateModal from '../../components/TeamCreateModal';
import TeamInviteModal from '../../components/TeamInviteModal';
import TeamRoleManager from '../../components/TeamRoleManager';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const PROJECTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID;
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id;
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Realtime subscription cleanup
  const [realtimeUnsubscribe, setRealtimeUnsubscribe] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await account.get();
        setUser(userData);
        const projectRes = await databases.getDocument(DB_ID, PROJECTS_COLLECTION_ID, projectId);
        setProject(projectRes);
        const { Query } = await import('appwrite');
        const tasksRes = await databases.listDocuments(DB_ID, TASKS_COLLECTION_ID, [
          Query.equal('project_id', projectId)
        ]);
        setTasks(tasksRes.documents);
        // Optionally fetch team members if project.team_id exists
        // ...
      } catch (err) {
        router.replace('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    if (projectId) fetchData();
  }, [projectId, router]);

  // Realtime subscription for tasks
  useEffect(() => {
    if (!projectId) return;
    // Import Appwrite client for realtime
    let unsubscribe = null;
    import('appwrite').then(({ Client, Databases }) => {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
      const databasesRT = new Databases(client);
      // Subscribe to changes in the tasks collection for this project
      unsubscribe = client.subscribe(
        `databases.${DB_ID}.collections.${TASKS_COLLECTION_ID}.documents`,
        response => {
          const { events, payload } = response;
          // Only update if the task is for this project
          if (payload.project_id !== projectId) return;
          if (events.includes('databases.*.collections.*.documents.*.create')) {
            setTasks(prev => [...prev, payload]);
          } else if (events.includes('databases.*.collections.*.documents.*.update')) {
            setTasks(prev => prev.map(t => t.$id === payload.$id ? payload : t));
          } else if (events.includes('databases.*.collections.*.documents.*.delete')) {
            setTasks(prev => prev.filter(t => t.$id !== payload.$id));
          }
        }
      );
      setRealtimeUnsubscribe(() => unsubscribe);
    });
    // Cleanup on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-lg text-gray-600 animate-pulse">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-400">Project not found.</div>
      </div>
    );
  }

  // Group tasks by status
  const columns = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  };
  // Team ID for permissions
  const teamId = project?.team_id;

  // Handle drag end
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
    // Find the task
    const movedTask = tasks.find(t => t.$id === draggableId);
    if (!movedTask) return;
    // Update status locally
    // Map droppableId to Appwrite status values
    let statusValue = destination.droppableId === 'inprogress' ? 'in_progress' : destination.droppableId;
    const updatedTask = { ...movedTask, status: statusValue };
    const newTasks = tasks.map(t => t.$id === draggableId ? updatedTask : t);
    setTasks(newTasks);
    // Persist status change to Appwrite with team permissions
    try {
      let teamId = project?.team_id;
      let permissions = teamId ? [
        // Team members can read, update, delete, write
        Permission.read(Role.team(teamId)),
        Permission.update(Role.team(teamId)),
        Permission.delete(Role.team(teamId)),
        Permission.write(Role.team(teamId)),
      ] : [
        Permission.read(Role.user(user?.$id)),
        Permission.update(Role.user(user?.$id)),
        Permission.delete(Role.user(user?.$id)),
        Permission.write(Role.user(user?.$id)),
      ];
      await databases.updateDocument(DB_ID, TASKS_COLLECTION_ID, draggableId, { status: statusValue }, permissions);
    } catch (err) {
      // Optionally revert UI if error
      console.error('Task update error:', err);
      setTasks(tasks);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Sidebar
        user={user}
        onLogout={async () => {
          try {
            await account.deleteSession('current');
          } catch (err) {}
          router.replace('/login');
        }}
      />
      <main className="flex-1 flex flex-col px-0 py-0">
        <section className="w-full px-0 py-0">
          {/* Project Overview */}
          <div className="w-full bg-white/70 shadow-sm border-b border-gray-100 px-4 py-6 md:px-12 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-indigo-800 mb-2">{project.name}</h2>
              <div className="text-base md:text-lg text-gray-600 mb-2">{project.description}</div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-xs md:text-sm text-gray-400">
                <span>Created: {new Date(project.$createdAt).toLocaleDateString()}</span>
                <span className="hidden md:inline">&bull;</span>
                <span>By: {project.created_by === user?.$id ? 'You' : project.created_by}</span>
              </div>
            </div>
            {/* Placeholder for project actions or quick stats */}
            <div className="flex gap-3">
              {/* Add action buttons or stats here in future */}
            </div>
          </div>
          {/* Task creation modal and Kanban board */}
          <div className="w-full px-2 py-6 md:px-6 md:py-12">
            <div className="mb-6 md:mb-8 flex justify-end">
              <TaskCreateModal
                projectId={projectId}
                user={user}
                onTaskCreated={task => setTasks(prev => [...prev, task])}
              />
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-x-visible">
                <div className="flex md:hidden gap-2 mb-4">
                  {/* Show column headers for mobile */}
                  {['todo', 'in_progress', 'done'].map(colId => (
                    <span key={colId} className="flex-1 text-center text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg py-2">
                      {colId === 'todo' ? 'To Do' : colId === 'in_progress' ? 'In Progress' : 'Done'}
                    </span>
                  ))}
                </div>
                {['todo', 'in_progress', 'done'].map(colId => (
                  <Droppable droppableId={colId} key={colId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-white rounded-2xl shadow-lg p-3 md:p-6 min-h-[250px] md:min-h-[350px] border border-gray-100 flex flex-col transition ${snapshot.isDraggingOver ? 'ring-2 ring-indigo-300' : ''} w-full md:w-auto mb-4 md:mb-0`}
                        style={{ minWidth: '260px' }}
                      >
                        <h3 className="hidden md:block text-xl font-bold mb-4 text-indigo-600">{colId === 'todo' ? 'To Do' : colId === 'in_progress' ? 'In Progress' : 'Done'}</h3>
                        <div className="flex-1 space-y-4">
                          {columns[colId].length === 0 ? (
                            <div className="text-gray-400">No tasks</div>
                          ) : (
                            columns[colId].map((task, idx) => (
                              <Draggable draggableId={task.$id} index={idx} key={task.$id}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-indigo-50 p-3 md:p-4 rounded-lg border border-indigo-100 shadow-sm transition cursor-pointer ${snapshot.isDragging ? 'ring-2 ring-indigo-400' : ''}`}
                                    onClick={() => {
                                      setSelectedTask(task);
                                      setSidebarOpen(true);
                                    }}
                                  >
                                    <div className="font-semibold text-gray-800 text-base md:text-lg">{task.title}</div>
                                    <div className="text-xs md:text-sm text-gray-500 mt-1">{task.description}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
          {/* Task detail sidebar */}
          <TaskDetailSidebar
            task={selectedTask}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onTaskUpdated={updated => {
              setTasks(tasks => tasks.map(t => t.$id === updated.$id ? updated : t));
            }}
            onTaskDeleted={deletedId => {
              setTasks(tasks => tasks.filter(t => t.$id !== deletedId));
              setSidebarOpen(false);
            }}
          />
          {/* Per-task comments: show in sidebar if a task is selected */}
          {selectedTask && sidebarOpen && (
            <div className="fixed top-0 right-0 h-full w-full md:max-w-md z-[60] pointer-events-auto">
              <CommentThread
                taskId={selectedTask.$id}
                projectId={projectId}
                user={user}
                teamId={teamId}
              />
            </div>
          )}
          {/* Real-time comments for the project */}
          <div className="w-full px-2 md:px-6 mt-8 mb-8">
            {/* Comments for the project itself (not per task) */}
            <CommentThread
              projectId={projectId}
              user={user}
              teamId={teamId}
            />
          </div>
          {/* Analytics section placeholder */}
          <div className="w-full px-2 md:px-6 mt-8 mb-8">
            <h3 className="text-lg md:text-2xl font-bold text-indigo-700 mb-4">Project Analytics (Coming Soon)</h3>
            <div className="bg-white rounded-xl shadow p-4 md:p-6 text-gray-400">Charts and progress metrics will appear here.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
