"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormError, FormSuccess } from "@/components/ui/form-messages";
import { Shield, GalleryVerticalEnd } from "lucide-react";

export default function TwoFactorPage() {
    const router = useRouter();
    const [totpCode, setTotpCode] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [backupCode, setBackupCode] = useState("");
    const [trustDevice, setTrustDevice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("totp");

    const handleVerifyTOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!totpCode || totpCode.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.verifyTotp({
                code: totpCode,
                trustDevice,
            });

            if (error) {
                setError(error.message || "Invalid code");
            } else {
                setSuccess("Verification successful!");
                setTimeout(() => router.push("/dashboard"), 1000);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async () => {
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.sendOtp({});

            if (error) {
                setError(error.message || "Failed to send OTP");
            } else {
                setSuccess("OTP sent to your email!");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.verifyOtp({
                code: otpCode,
                trustDevice,
            });

            if (error) {
                setError(error.message || "Invalid code");
            } else {
                setSuccess("Verification successful!");
                setTimeout(() => router.push("/dashboard"), 1000);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyBackupCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!backupCode || backupCode.trim().length === 0) {
            setError("Please enter a backup code");
            return;
        }

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.verifyBackupCode({
                code: backupCode,
                trustDevice,
            });

            if (error) {
                setError(error.message || "Invalid backup code");
            } else {
                setSuccess("Verification successful!");
                setTimeout(() => router.push("/dashboard"), 1000);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

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

                {/* 2FA Verification Card */}
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
                        <CardDescription>
                            Enter your verification code to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormSuccess message={success} />
                        <FormError message={error} />

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="totp">App</TabsTrigger>
                                <TabsTrigger value="otp">Email</TabsTrigger>
                                <TabsTrigger value="backup">Backup</TabsTrigger>
                            </TabsList>

                            <TabsContent value="totp" className="space-y-4">
                                <form onSubmit={handleVerifyTOTP} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="totp">Authenticator Code</Label>
                                        <Input
                                            id="totp"
                                            type="text"
                                            placeholder="000000"
                                            value={totpCode}
                                            onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                                            maxLength={6}
                                            className="text-center text-2xl tracking-widest"
                                        />
                                        <p className="text-xs text-muted-foreground text-center">
                                            Enter the 6-digit code from your authenticator app
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="trust-totp"
                                            checked={trustDevice}
                                            onChange={(e) => setTrustDevice(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="trust-totp" className="text-sm font-normal cursor-pointer">
                                            Trust this device for 30 days
                                        </Label>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isLoading || totpCode.length !== 6}>
                                        {isLoading ? "Verifying..." : "Verify Code"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="otp" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="rounded-lg border bg-muted/50 p-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            We'll send a verification code to your registered email
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleSendOTP}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Sending..." : "Send Code to Email"}
                                    </Button>

                                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp">Email Code</Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                placeholder="000000"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                                maxLength={6}
                                                className="text-center text-2xl tracking-widest"
                                            />
                                            <p className="text-xs text-muted-foreground text-center">
                                                Enter the code sent to your email
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="trust-otp"
                                                checked={trustDevice}
                                                onChange={(e) => setTrustDevice(e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <Label htmlFor="trust-otp" className="text-sm font-normal cursor-pointer">
                                                Trust this device for 30 days
                                            </Label>
                                        </div>

                                        <Button type="submit" className="w-full" disabled={isLoading || otpCode.length !== 6}>
                                            {isLoading ? "Verifying..." : "Verify Code"}
                                        </Button>
                                    </form>
                                </div>
                            </TabsContent>

                            <TabsContent value="backup" className="space-y-4">
                                <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 p-4">
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        Each backup code can only be used once
                                    </p>
                                </div>

                                <form onSubmit={handleVerifyBackupCode} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="backup">Backup Code</Label>
                                        <Input
                                            id="backup"
                                            type="text"
                                            placeholder="Enter your backup code"
                                            value={backupCode}
                                            onChange={(e) => setBackupCode(e.target.value)}
                                            className="font-mono"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Use one of the backup codes you saved
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="trust-backup"
                                            checked={trustDevice}
                                            onChange={(e) => setTrustDevice(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="trust-backup" className="text-sm font-normal cursor-pointer">
                                            Trust this device for 30 days
                                        </Label>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isLoading || !backupCode.trim()}>
                                        {isLoading ? "Verifying..." : "Verify Code"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="text-center pt-4">
                            <Link
                                href="/auth/login"
                                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                            >
                                Back to login
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Text */}
                <p className="px-6 text-center text-xs text-muted-foreground">
                    Having trouble? Contact support for assistance with your account.
                </p>
            </div>
        </div>
    );
}
