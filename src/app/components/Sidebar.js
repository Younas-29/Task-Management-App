import { useRouter } from 'next/navigation';
import { User, Home, LogOut, PlusCircle } from 'lucide-react';

export default function Sidebar({ user, LogoutButton, onLogout }) {
  const router = useRouter();
  return (
    <aside className="w-64 bg-white shadow-xl flex flex-col p-6 border-r border-gray-200 min-h-screen">
      <div className="mb-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 flex items-center justify-center mb-2">
          <User className="text-white w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">TaskFlow</h1>
        <span className="text-xs text-gray-400 mt-1">Project Dashboard</span>
      </div>
      <nav className="flex flex-col gap-3 mb-8">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
          onClick={() => router.push('/dashboard')}
        >
          <Home className="w-5 h-5" />
          Dashboard
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
          onClick={() => router.push('/project/create')}
        >
          <PlusCircle className="w-5 h-5" />
          New Project
        </button>
      </nav>
      <div className="mt-auto pt-8 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-gray-700">{user?.name || user?.email}</span>
        </div>
        <div className="text-xs text-gray-400 mb-4">Logged in as</div>
        <div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition w-full"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
