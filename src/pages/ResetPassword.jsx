import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {PasswordInput} from "@/components/ui/password-input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {useNavigate, useParams} from "react-router-dom";
import {useAuthStore} from "@/store/useAuthStore";

const formSchema = z
    .object({
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(50, "Password is too long"),
        confirmPassword: z
            .string()
            .min(6, "Confirm password must be at least 6 characters")
            .max(50, "Confirm password is too long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
export default function ResetPassword() {
    const navigate = useNavigate();
    const {token} = useParams();
    const {resetPassword} = useAuthStore();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });
    const onSubmit = async (data) => {
        resetPassword(token, data.password).then(() => navigate("/login"));
    };
    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder="*********" {...field} />
                                </FormControl>
                                <FormDescription>Enter a new password.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder="*********" {...field} />
                                </FormControl>
                                <FormDescription>Confirm your new password.</FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Reset Password</Button>
                </form>
            </Form>
        </div>
    );
}
