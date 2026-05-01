import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LandingPage from "./LandingPage";
import Login from "./Login";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminBooks from "./AdminBooks";
import AdminPosts from "./AdminPosts";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="posts" element={<AdminPosts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
