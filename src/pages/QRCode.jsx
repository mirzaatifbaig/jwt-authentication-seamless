import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/useAuthStore.jsx";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/components/ui/input-otp";
import Loading from "@/components/Loading.jsx";

export default function QRCode() {
    const navigate = useNavigate();
    const {logout, qrCode, verify2FA} = useAuthStore();
    let otp = "";
    useEffect(() => {
        const checkAndRedirect = setTimeout(() => {
            if (!qrCode) {
                toast.error("QR code expired or missing.");
                navigate("/dashboard");
            }
        }, 1000);
        return () => clearTimeout(checkAndRedirect);
    }, [qrCode, navigate]);
    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-6">
            <div className="flex-grow flex items-center justify-center">
                {qrCode ? (
                    <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-72 h-72 object-contain rounded"
                    />
                ) : (
                    <Loading/>
                )}
            </div>
            <div className="flex flex-col items-center gap-2 mt-6">
                <p className="text-sm text-muted-foreground">Enter OTP to verify</p>
                <InputOTP
                    maxLength={6}
                    onChange={(val) => {
                        otp = val;
                        if (otp.length === 6) {
                            verify2FA(otp).then(() => navigate("/dashboard"));
                        }
                    }}
                >
                    <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i}/>
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <div className="w-full flex justify-center gap-3 mt-6">
                <Button variant="destructive" onClick={logout}>
                    Logout
                </Button>
                <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            </div>
        </div>
    );
}
