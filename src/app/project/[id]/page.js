'use client';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useRouter, useParams } from 'next/navigation';
import { account, databases } from '@/lib/appwrite';
import Sidebar from '../../components/Sidebar';
import TaskCreateModal from '../../components/TaskCreateModal';
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

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await account.get();
        setUser(userData);
        const projectRes = await databases.getDocument(DB_ID, PROJECTS_COLLECTION_ID, projectId);
        setProject(projectRes);
        const tasksRes = await databases.listDocuments(DB_ID, TASKS_COLLECTION_ID, [
          // Query.equal('project_id', projectId)
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
    inprogress: tasks.filter(t => t.status === 'inprogress'),
    done: tasks.filter(t => t.status === 'done'),
  };

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
    const updatedTask = { ...movedTask, status: destination.droppableId };
    const newTasks = tasks.map(t => t.$id === draggableId ? updatedTask : t);
    setTasks(newTasks);
    // Persist status change to Appwrite
    try {
      await databases.updateDocument(DB_ID, TASKS_COLLECTION_ID, draggableId, { status: destination.droppableId });
    } catch (err) {
      // Optionally revert UI if error
      setTasks(tasks);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col px-0 py-0">
        <section className="w-full px-0 py-0">
          {/* Project Overview */}
          <div className="w-full bg-white/70 shadow-sm border-b border-gray-100 px-12 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-indigo-800 mb-2">{project.name}</h2>
              <div className="text-lg text-gray-600 mb-2">{project.description}</div>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>Created: {new Date(project.$createdAt).toLocaleDateString()}</span>
                <span>&bull;</span>
                <span>By: {project.created_by === user?.$id ? 'You' : project.created_by}</span>
              </div>
            </div>
            {/* Placeholder for project actions or quick stats */}
            <div className="flex gap-3">
              {/* Add action buttons or stats here in future */}
            </div>
          </div>
          {/* Kanban board with drag-and-drop */}
          <div className="w-full px-6 py-12">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['todo', 'inprogress', 'done'].map(colId => (
                  <Droppable droppableId={colId} key={colId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-white rounded-2xl shadow-lg p-6 min-h-[350px] border border-gray-100 flex flex-col transition ${snapshot.isDraggingOver ? 'ring-2 ring-indigo-300' : ''}`}
                      >
                        <h3 className="text-xl font-bold mb-4 text-indigo-600">{colId === 'todo' ? 'To Do' : colId === 'inprogress' ? 'In Progress' : 'Done'}</h3>
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
                                    className={`bg-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm transition ${snapshot.isDragging ? 'ring-2 ring-indigo-400' : ''}`}
                                  >
                                    <div className="font-semibold text-gray-800 text-lg">{task.title}</div>
                                    <div className="text-sm text-gray-500 mt-1">{task.description}</div>
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
          {/* Analytics section placeholder */}
          <div className="w-full px-6 mt-8 mb-8">
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">Project Analytics (Coming Soon)</h3>
            <div className="bg-white rounded-xl shadow p-6 text-gray-400">Charts and progress metrics will appear here.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
