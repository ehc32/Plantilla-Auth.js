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
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.46 16.55L18.66 12.21C19.47 10.87 19.92 9.32 19.92 7.66C19.92 3.43 16.49 0 12.26 0C8.03 0 4.6 3.43 4.6 7.66C4.6 9.32 5.05 10.87 5.86 12.21L3.06 16.55C2.28 17.76 2.51 19.37 3.61 20.31C4.71 21.25 6.35 21.25 7.45 20.31L12 16.68L16.55 20.31C17.65 21.25 19.29 21.25 20.39 20.31C21.49 19.37 21.72 17.76 20.94 16.55H21.46ZM12.26 4.14C13.83 4.14 15.1 5.41 15.1 6.98C15.1 8.55 13.83 9.82 12.26 9.82C10.69 9.82 9.42 8.55 9.42 6.98C9.42 5.41 10.69 4.14 12.26 4.14Z" />
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
