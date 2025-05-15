import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full">
      <h1 className="text-4xl font-extrabold text-red-500">404</h1>
      <p className="text-xl text-gray-700 mt-4">
        Oops! The page you are looking for doesn't exist.
      </p>
      <Button className="mt-6" onClick={goHome}>
        Go to Home
      </Button>
    </div>
  );
}
