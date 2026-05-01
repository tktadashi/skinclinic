import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const { user, isAdmin, loading, loginWithGoogle } = useAuth();

  const [loginError, setLoginError] = useState("");

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Carregando...</div>;
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async () => {
    try {
      setLoginError("");
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setLoginError("O pop-up de login foi fechado antes da conclusão. Se você está no modo de visualização, tente abrir o aplicativo em uma nova guia (botão no canto superior direito).");
      } else {
        setLoginError(err.message || "Erro ao fazer login com o Google.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
           <div className="mx-auto w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
               <Shield className="w-6 h-6" />
           </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Painel Administrativo</h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse para gerenciar seus e-books e posts.
          </p>
        </div>

        {loginError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
                {loginError}
            </div>
        )}

        {user && !isAdmin ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
                Você está logado como <strong>{user.email}</strong>, mas não tem permissão de administrador. Contate o suporte ou acesse com a conta correta.
            </div>
        ) : null}

        <button
          onClick={handleLogin}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors shadow-md"
        >
          Entrar com Google
        </button>
        
        <div className="mt-4 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">Voltar para o site</a>
        </div>
      </div>
    </div>
  );
}
