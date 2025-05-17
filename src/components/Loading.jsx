import {Loader} from "lucide-react";

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <Loader className="animate-spin mr-2 w-6 h-6"/>
            <span className="text-lg font-medium">
        Loading<span className="animate-pulse">...</span>
      </span>
        </div>
    );
};

export default Loading;
