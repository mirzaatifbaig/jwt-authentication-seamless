import {useAuthStore} from "@/store/useAuthStore.jsx";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/components/ui/input-otp";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function FALogin() {
    const {user, login2FA, logout} = useAuthStore();
    const [otp, setOtp] = useState("");

    useEffect(() => {
        toast.message("You have 2FA enabled!");
    }, []);

    const handleSubmit = async () => {
        if (otp.length !== 6) {
            toast.error("Enter a 6-digit code.");
            return;
        }
        await login2FA(otp);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        Two-Factor Authentication
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="text-center space-y-1">
                        <p className="text-lg font-semibold">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground">ID: {user?.id}</p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                                {[...Array(6)].map((_, i) => (
                                    <InputOTPSlot key={i} index={i}/>
                                ))}
                            </InputOTPGroup>
                        </InputOTP>

                        <Button className="w-full" onClick={handleSubmit}>
                            Submit OTP
                        </Button>

                        <Button variant="destructive" className="w-full" onClick={logout}>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
