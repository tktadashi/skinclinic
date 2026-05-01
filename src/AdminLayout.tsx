import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Book, FileText, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Livros/E-books", path: "/admin/books", icon: Book },
    { name: "Blog Posts", path: "/admin/posts", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900 tracking-tight">Admin<span className="text-teal-600">Panel</span></span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "bg-teal-50 text-teal-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-teal-600" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 flex items-center gap-3 px-3">
             <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
               {user?.photoURL ? <img src={user.photoURL} alt="Avatar" /> : <UserIcon className="w-full h-full text-gray-400 p-1"/>}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-medium text-gray-900 truncate">{user?.displayName || "Admin"}</p>
               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
             </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
           <span className="text-lg font-bold text-gray-900">Admin<span className="text-teal-600">Panel</span></span>
           <button onClick={handleLogout} className="p-2 text-gray-500">
             <LogOut className="w-5 h-5"/>
           </button>
        </header>

        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
