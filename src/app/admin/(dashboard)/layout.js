import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifySession } from '@/lib/auth';
import { isUsingMySQL } from '@/lib/dbBlog';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  LogOut, 
  Home, 
  ShieldCheck, 
  Database,
  ArrowLeft
} from 'lucide-react';

export default async function ProtectedAdminLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_session')?.value;
  const session = verifySession(token);

  // Enforce session check
  if (!session) {
    redirect('/admin');
  }

  const isMySQL = await isUsingMySQL();

  return (
    <div className="w-full flex-grow flex flex-col md:flex-row gap-6 font-sans">
      {/* Sidebar navigation */}
      <aside className="md:w-64 shrink-0 flex flex-col gap-4 animate-fade-up">
        {/* Profile Card */}
        <div className="glass-panel p-5 flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-500/5 blur-xl" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center text-sm text-white font-extrabold shadow-sm select-none">
              {session.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 dark:text-white leading-none">{session.username}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">{session.role}</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-850 my-1" />

          {/* Connection Status Badge */}
          <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-gray-400" />
              Source:
            </span>
            {isMySQL ? (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[8px]">
                MySQL Server
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider text-[8px]" title="MySQL offline, writing to JSON fallback">
                JSON File
              </span>
            )}
          </div>
        </div>

        {/* Navigation panel */}
        <div className="glass-panel p-3 flex flex-col gap-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-gray-650 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-500" />
            Stats Dashboard
          </Link>

          <Link
            href="/admin/blogs"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-gray-650 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            Manage Blog posts
          </Link>

          {session.role === 'admin' && (
            <Link
              href="/admin/users"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-gray-650 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <Users className="w-4 h-4 text-violet-500" />
              Manage Users
            </Link>
          )}

          <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-850 my-2" />

          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-gray-650 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <Home className="w-4 h-4 text-gray-400" />
            CC Bins Public site
          </Link>

          <a
            href="/api/admin/auth"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-red-600 hover:text-red-750 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Console Log Out
          </a>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-grow min-h-[500px]">
        {children}
      </main>
    </div>
  );
}
