import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();
  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 border-b bg-background z-50 shadow-xl">
      <div className="flex items-center space-x-2">
        <Home className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold m-4">App</span>
      </div>
      <div className="flex items-center space-x-2 mx-4">
        {isAuthenticated && <Button onClick={logout}>Logout</Button>}
        {!isAuthenticated && (
          <Button onClick={() => navigate("/signup")}>Signup</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
