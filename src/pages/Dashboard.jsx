import {Button} from "@/components/ui/button";
import {useAuthStore} from "@/store/useAuthStore";
import Loading from "@/components/Loading.jsx";
import {useEffect} from "react";

const Dashboard = () => {
  const { isCheckingAuth, checkAuth, user, logout, testProtected } =
    useAuthStore();
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
        <p className="text-muted-foreground p-2 mt-2">
            This is protected content.
        </p>
        <div className={"flex flex-col items-center justify-around"}>
            <Button className={""} onClick={logout}>
                Logout
            </Button>
            <Button className={"mt-4"} onClick={testProtected}>
                Access Protected Route
            </Button>
        </div>
    </div>
  );
};

export default Dashboard;
