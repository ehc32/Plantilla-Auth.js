"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Shield } from "lucide-react";

export default function TwoFactorPage() {
    const router = useRouter();
    const [totpCode, setTotpCode] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [backupCode, setBackupCode] = useState("");
    const [trustDevice, setTrustDevice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVerifyTOTP = async (e: React.FormEvent) => {
        e.preventDefault();
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
            <div className="flex w-full max-w-md flex-col gap-6">
                <div className="flex items-center justify-center gap-2">
                    <Shield className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Verify Your Identity</CardTitle>
                        <CardDescription>
                            Please enter your verification code to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormSuccess message={success} />
                        <FormError message={error} />

                        <Tabs defaultValue="totp" className="mt-4">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="totp">TOTP</TabsTrigger>
                                <TabsTrigger value="otp">Email OTP</TabsTrigger>
                                <TabsTrigger value="backup">Backup</TabsTrigger>
                            </TabsList>

                            <TabsContent value="totp">
                                <form onSubmit={handleVerifyTOTP} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="totp">Authenticator Code</Label>
                                        <Input
                                            id="totp"
                                            type="text"
                                            placeholder="000000"
                                            value={totpCode}
                                            onChange={(e) => setTotpCode(e.target.value)}
                                            maxLength={6}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Enter the 6-digit code from your authenticator app
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="trust-totp"
                                            checked={trustDevice}
                                            onChange={(e) => setTrustDevice(e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="trust-totp" className="text-sm font-normal">
                                            Trust this device for 30 days
                                        </Label>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Verifying..." : "Verify Code"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="otp">
                                <div className="space-y-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleSendOTP}
                                        disabled={isLoading}
                                    >
                                        Send OTP to Email
                                    </Button>

                                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp">Email Code</Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                placeholder="000000"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                maxLength={6}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Enter the 6-digit code sent to your email
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="trust-otp"
                                                checked={trustDevice}
                                                onChange={(e) => setTrustDevice(e.target.checked)}
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor="trust-otp" className="text-sm font-normal">
                                                Trust this device for 30 days
                                            </Label>
                                        </div>

                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Verifying..." : "Verify Code"}
                                        </Button>
                                    </form>
                                </div>
                            </TabsContent>

                            <TabsContent value="backup">
                                <form onSubmit={handleVerifyBackupCode} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="backup">Backup Code</Label>
                                        <Input
                                            id="backup"
                                            type="text"
                                            placeholder="Enter backup code"
                                            value={backupCode}
                                            onChange={(e) => setBackupCode(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Use one of your backup codes
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="trust-backup"
                                            checked={trustDevice}
                                            onChange={(e) => setTrustDevice(e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="trust-backup" className="text-sm font-normal">
                                            Trust this device for 30 days
                                        </Label>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Verifying..." : "Verify Code"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
