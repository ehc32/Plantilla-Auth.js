"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../../app/auth/login/action";
import { FormSuccess, FormError } from "../ui/form-messages";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const [isVisible, setIsVisible] = useState(false);
  const [formState, setFormState] = useState<{
    success?: string;
    error?: string;
  }>({});
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);

  const id = useId();
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const onSubmit = async (data: FormData) => {
    setFormState({});
    const result = await loginUser(data);

    if (result.success) {
      // Check if 2FA verification is required
      if (result.data?.twoFactorRedirect) {
        router.push("/auth/2fa");
      } else {
        setFormState({ success: result.success.reason });
        router.push("/dashboard");
      }
    } else if (result.error) {
      setFormState({ error: result.error.reason });
    }
  };

  const handleMagicLink = async () => {
    const email = watch("email");
    if (!email) {
      setFormState({ error: "Please enter your email address to sign in with Magic Link" });
      return;
    }
    // Simple email regex check if needed, or rely on server response
    setMagicLinkLoading(true);
    try {
      const { error } = await import("@/lib/auth-client").then(m => m.signInWithMagicLink(email));
      if (error) {
        setFormState({ error: error.message || "Failed to send magic link" });
      } else {
        setFormState({ success: "Magic link sent! Check your email." });
      }
    } catch (e) {
      setFormState({ error: "An unexpected error occurred" });
    } finally {
      setMagicLinkLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5"
      >
        <FormSuccess message={formState.success || ""} />
        <FormError message={formState.error || ""} />
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={id}>Password</Label>
            <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id={id}
              type={isVisible ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              className="pe-9"
              {...register("password")}
            />
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or sign in with
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full"
        type="button"
        onClick={handleMagicLink}
        disabled={magicLinkLoading || isSubmitting}
      >
        {magicLinkLoading ? "Sending..." : "Magic Link"}
      </Button>
    </div>
  );
};

export default LoginForm;
