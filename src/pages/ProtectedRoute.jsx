import {useAuthStore} from "@/store/useAuthStore.jsx";
import {Navigate} from "react-router-dom";
import Loading from "@/components/Loading.jsx";

const ProtectedRoute = ({children}) => {
    const {isAuthenticated, isLoading} = useAuthStore();

    if (isLoading) {
        return <Loading/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};
export default ProtectedRoute;
