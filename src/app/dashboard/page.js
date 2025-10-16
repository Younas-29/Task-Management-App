'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import Sidebar from '../components/Sidebar';
import ProjectCreateModal from '../components/ProjectCreateModal';
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
const PROJECTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID;

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [teamIds, setTeamIds] = useState([]);
  const router = useRouter();

  // Fetch user and their teams
  useEffect(() => {
    async function fetchUserAndTeams() {
      try {
        const userData = await account.get();
        setUser(userData);
        // Get user's teams via memberships
        const membershipsRes = await account.listMemberships();
        const ids = membershipsRes.memberships.map(m => m.teamId);
        setTeamIds(ids);
      } catch (err) {
        // Only redirect if error is due to authentication
        if (err?.code === 401 || err?.message?.toLowerCase().includes('unauth')) {
          if (window.location.pathname !== '/login') {
            router.replace('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndTeams();
  }, [router]);

  // Fetch projects for user (created_by or team_id)
  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      try {
        // Query for projects created by user
        const createdRes = await databases.listDocuments(DB_ID, PROJECTS_COLLECTION_ID, [
          Query.equal('created_by', user.$id)
        ]);
        console.log('DEBUG: Personal projects fetched:', createdRes.documents);
        // Query for projects in user's teams
        let teamRes = { documents: [] };
        if (teamIds.length > 0) {
          teamRes = await databases.listDocuments(DB_ID, PROJECTS_COLLECTION_ID, [
            Query.equal('team_id', teamIds)
          ]);
          console.log('DEBUG: Team projects fetched:', teamRes.documents);
        }
        // Merge and deduplicate
        const allProjects = [...createdRes.documents, ...teamRes.documents];
        const uniqueProjects = Object.values(
          allProjects.reduce((acc, proj) => {
            acc[proj.$id] = proj;
            return acc;
          }, {})
        );
        console.log('DEBUG: All unique projects:', uniqueProjects);
        setProjects(uniqueProjects);
      } catch (err) {
        console.error('DEBUG: Error fetching projects:', err);
      }
    }
    fetchProjects();
  }, [user, teamIds]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-lg text-gray-600 animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Sidebar user={user} LogoutButton={null} />
      <main className="flex-1 flex flex-col items-center justify-start px-0 py-0">
        <section className="w-full max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Projects</h2>
            <ProjectCreateModal
              onProjectCreated={project => setProjects(prev => [...prev, project])}
              user={user}
            />
          </div>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-6 text-indigo-300"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
              <div className="text-xl text-gray-400 mb-2">No projects found</div>
              <div className="text-gray-500 mb-4">Create a new project to get started.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map(project => (
                <div
                  key={project.$id}
                  className={`bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition cursor-pointer group ${selectedProjectId === project.$id ? 'ring-2 ring-indigo-400' : ''}`}
                  onClick={() => router.push(`/project/${project.$id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-indigo-700 group-hover:text-indigo-900 transition">{project.name}</h3>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">{project.team_id ? 'Team' : 'Personal'}</span>
                  </div>
                  <div className="text-gray-600 mb-4">{project.description}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Created: {new Date(project.$createdAt).toLocaleDateString()}</span>
                    <span>&bull;</span>
                    <span>By: {project.created_by === user?.$id ? 'You' : project.created_by}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}