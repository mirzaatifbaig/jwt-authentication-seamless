import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/useAuthStore";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuthStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    forgotPassword(data).then((response) => {
      console.log(response);
    });
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        {isSubmitted ? "Check your email" : "Forgot Password"}
      </h1>
      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user@email.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the email associated with your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        </Form>
      ) : (
        <div>
          <p className="text-lg">
            Please check your inbox for a password reset link.
          </p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Back to Login
          </Button>
        </div>
      )}
    </div>
  );
}
