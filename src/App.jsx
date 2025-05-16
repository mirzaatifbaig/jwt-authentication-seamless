import {Route, Routes} from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Navbar from "@/components/Navbar";
import ForgotPassword from "@/pages/ForgetPassword";
import ResetPassword from "@/pages/ResetPassword";
import {Toaster} from "sonner";
import ProtectedRoute from "@/pages/ProtectedRoute.jsx";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster richColors position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
