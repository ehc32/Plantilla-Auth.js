"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon, GithubIcon } from "@/components/ui/icons";
import { signInWithGithub, signInWithGoogle, signInWithPasskey, signInWithTikTok, signInWithAuth0 } from "@/lib/auth-client";
import { GalleryVerticalEnd, Fingerprint } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image
              src="/logo.png"
              alt="Logo"
              width={16}
              height={16}
              className="size-4"
            />
          </div>
          Zexa Better Auth
        </Link>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Login with your social account or email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={signInWithGoogle}
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={signInWithGithub}
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={signInWithPasskey}
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Continue with Passkey
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={signInWithTikTok}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.25-5.23v-8.51a8.84 8.84 0 0 0 3.83 1.43v-3.74a4.88 4.88 0 0 1 .15-.26Z" />
                </svg>
                Continue with TikTok
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={signInWithAuth0}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.98 7.448L19.62 0H16.024L18.383 7.448C18.596 8.096 18.717 8.779 18.717 9.49C18.717 12.955 15.859 15.762 12.334 15.762C8.809 15.762 5.951 12.955 5.951 9.49C5.951 8.779 6.072 8.096 6.285 7.448L8.644 0H5.048L2.688 7.448C2.244 8.841 2 10.321 2 11.857C2 17.747 6.89 22.571 12.867 22.571C18.844 22.571 23.734 17.747 23.734 11.857C23.734 10.321 23.49 8.841 23.046 7.448L21.98 7.448Z" />
                </svg>
                Continue with Auth0
              </Button>
            </div>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <LoginForm />

            {/* Forgot Password */}
            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="underline underline-offset-4 hover:text-primary font-medium"
          >
            Sign up
          </Link>
        </div>

        {/* Terms */}
        <p className="px-6 text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div >
  );
};

export default LoginPage;
