import {Button} from "@/components/ui/button";
import {useAuthStore} from "@/store/useAuthStore";
import Loading from "@/components/Loading.jsx";
import {useEffect} from "react";
import {Link} from "react-router-dom";

const Dashboard = () => {
    const {
        isCheckingAuth,
        disable2FA,
        twoFactorEnabled,
        refreshTokenFn,
        checkAuth,
        enable2FA,
        user,
        logout,
        testProtected,
    } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    if (isCheckingAuth) {
        return <Loading/>;
    }
    return (
        <div className="max-w-2xl mx-auto mt-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="text-lg">
                Hello, <strong>{user?.name}</strong>!
            </p>
            <p className="text-lg">
                ID: <strong>{user?.id}</strong>
            </p>
            <p className="text-lg">
                Email: <strong>{user?.email}</strong>
            </p>
            <p className="text-lg">
                2Factor Enabled:{" "}
                <strong>{user?.twoFactorEnabled ? <>Yes</> : <>Not Yet</>}</strong>
            </p>
            <div className={"flex flex-col items-center justify-around"}>
                <Button className={""} onClick={logout}>
                    Logout
                </Button>
                <Button className={"mt-4"} onClick={testProtected}>
                    Access Protected Route
                </Button>
                {twoFactorEnabled ? (
                    <Button onClick={disable2FA} className={"!bg-red-600 mt-4"}>
                        DisableTwoFactor
                    </Button>
                ) : (
                    <Button className={"mt-4"} onClick={enable2FA}>
                        <Link className={"!text-white"} to="/qrcode">
                            Enable 2FA
                        </Link>
                    </Button>
                )}
                <Button className={"mt-4"} onClick={refreshTokenFn}>
                    Refresh Token!
                </Button>
            </div>
        </div>
    );
};

export default Dashboard;
