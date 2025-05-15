import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {useAuthStore} from "@/store/useAuthStore.jsx";

const Home = () => {
  const navigate = useNavigate();
  const {isAuthenticated} =  useAuthStore();
  if (isAuthenticated) navigate("/dashboard");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our App</h1>
      <div className="space-x-4">
        <Button onClick={() => navigate("/login")}>Login</Button>
        <Button variant="outline" onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Home;
