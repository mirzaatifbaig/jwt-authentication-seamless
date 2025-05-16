"use client";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {useAuthStore} from "@/store/useAuthStore";
import {Link, useNavigate} from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(1).min(4),
  email: z.string(),
  password: z.string(),
});

export default function Signup() {
  const navigate = useNavigate();
    const {isAuthenticated, signup} = useAuthStore();
    if (isAuthenticated) navigate("/dashboard");
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data) {
    console.log(data);
    signup(data.name, data.email, data.password).then(() =>
      navigate("/dashboard"),
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <div className="col-span-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@email.com" type="email" {...field} />
              </FormControl>
              <FormDescription>Enter your Email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="*************" {...field} />
              </FormControl>
              <FormDescription>Set a strong password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
          <Link to={"/login"}>
              {" "}
              <span
                  className={
                      "hover:underline hover:text-cyan-900 text-sm p-3 text-cyan-600"
                  }
              >
            {" "}
                  Login Instead?
          </span>
          </Link>
      </form>
    </Form>
  );
}
