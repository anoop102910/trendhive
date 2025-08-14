import { useLogin } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import setBox from "@/assets/product-utensil-set.jpg";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const { mutate, isPending } = useLogin();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = values => {
    mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <Card className="flex w-full max-w-4xl overflow-hidden md:flex-row flex-col">
        <div className=" text-gray-700  flex flex-col h-full relative justify-center bg-green-400 items-start md:w-1/2 w-full">
          <h2 className="text-3xl font-bold mb-4 absolute bottom-10 left-10">
            Simplify management with our dashboard.
          </h2>
          <img src={setBox} alt="Dashboard illustration" className="object-fill" />
        </div>

        {/* Right Side - Login Form */}
        <CardContent className="md:w-1/2 w-full p-10 flex flex-col justify-center">
          <CardHeader className="mb-6 space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Please login to your account</CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" type="email" {...field} />
                    </FormControl>
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
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-2">Or login with</span>
            <div className="flex gap-2">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Facebook</Button>
            </div>
            <p className="mt-4 text-sm text-center">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-orange-500">
                Signup
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
