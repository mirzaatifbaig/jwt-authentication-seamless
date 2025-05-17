import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {useAuthStore} from "@/store/useAuthStore";
import {useEffect} from "react";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});
export default function Login() {
    const navigate = useNavigate();
    const {login, isLoading, isAuthenticated, isLoadingAuth} = useAuthStore();
    useEffect(() => {
        if (!isLoadingAuth && isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, isLoadingAuth, navigate]);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data) {
        login(data.email, data.password).then((response) => {
            if (response?.requires2FA) {
                navigate("/twofalogin");
            } else {
                navigate("/dashboard");
            }
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-3xl mx-auto py-10"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="user@email.com" type="email" {...field} />
                            </FormControl>
                            <FormDescription>Enter your email.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="*********" {...field} />
                            </FormControl>
                            <FormDescription>Enter your password.</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Submit"}
                </Button>
                <Link to={"/forgot-password"}>
                    {" "}
                    <span
                        className={
                            "hover:underline hover:text-cyan-900 text-sm p-3 text-cyan-600"
                        }
                    >
            {" "}
                        Forgot Password?
          </span>
                </Link>
            </form>
        </Form>
    );
}
