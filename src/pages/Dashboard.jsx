import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import Loading from "@/components/Loading.jsx";
import { useEffect } from "react";

const Dashboard = () => {
  const { isCheckingAuth, checkAuth, user, logout, testProtected } =
    useAuthStore();

  const test = () => {
    testProtected()
  };
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) {
    return <Loading />;
  }
  return (
    <div className="max-w-2xl mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-lg">
        Hello, <strong>{user?.email}</strong>!
      </p>
      <p className="text-muted-foreground mt-2">This is protected content.</p>
      <Button onClick={logout}>Logout</Button>
      <Button onClick={test}>Access Protected Route</Button>
    </div>
  );
};

export default Dashboard;
