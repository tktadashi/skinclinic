import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "./firebase";
import { Book, FileText, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ books: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const booksCount = await getCountFromServer(collection(db, "books"));
        const postsCount = await getCountFromServer(collection(db, "posts"));
        
        setStats({
          books: booksCount.data().count,
          posts: postsCount.data().count
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Visão Geral</h1>
      
      {loading ? (
        <p className="text-gray-500">Carregando métricas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total de E-books" value={stats.books} icon={Book} color="bg-blue-50 text-blue-600" />
          <StatCard title="Posts Publicados" value={stats.posts} icon={FileText} color="bg-purple-50 text-purple-600" />
          <StatCard title="Acessos (Breve)" value="--" icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
          <StatCard title="Vendas Kiwify (Breve)" value="--" icon={Users} color="bg-orange-50 text-orange-600" />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center">
      <div className={`p-4 rounded-xl mr-5 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
