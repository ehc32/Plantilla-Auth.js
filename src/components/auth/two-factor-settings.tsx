"use client";

import { useState } from "react";
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
import { FormError, FormSuccess } from "@/components/ui/form-messages";
import { Shield, Copy, Check } from "lucide-react";
import QRCode from "react-qr-code";

interface TwoFactorSettingsProps {
    currentUser: {
        twoFactorEnabled: boolean;
        email: string;
    };
}

export default function TwoFactorSettings({ currentUser }: TwoFactorSettingsProps) {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [totpUri, setTotpUri] = useState("");
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [verificationCode, setVerificationCode] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleEnable2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.enable({
                password,
            });

            if (error) {
                setError(error.message || "Failed to enable 2FA");
            } else if (data) {
                setTotpUri(data.totpURI);
                setBackupCodes(data.backupCodes || []);
                setSuccess("2FA enabled! Please scan the QR code with your authenticator app.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.disable({
                password,
            });

            if (error) {
                setError(error.message || "Failed to disable 2FA");
            } else {
                setSuccess("2FA has been disabled");
                setTotpUri("");
                setBackupCodes([]);
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyTOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.verifyTotp({
                code: verificationCode,
            });

            if (error) {
                setError(error.message || "Invalid code");
            } else {
                setSuccess("2FA verified successfully!");
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateBackupCodes = async () => {
        const pwd = prompt("Enter your password to generate new backup codes:");
        if (!pwd) return;

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.generateBackupCodes({
                password: pwd,
            });

            if (error) {
                setError(error.message || "Failed to generate backup codes");
            } else if (data) {
                setBackupCodes(data.backupCodes || []);
                setSuccess("New backup codes generated!");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
            </div>

            <FormSuccess message={success} />
            <FormError message={error} />

            {!currentUser.twoFactorEnabled ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Enable 2FA</CardTitle>
                        <CardDescription>
                            Add an extra layer of security to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!totpUri ? (
                            <form onSubmit={handleEnable2FA} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Confirm Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Enabling..." : "Enable 2FA"}
                                </Button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Scan QR Code</h3>
                                        <div className="bg-white p-4 rounded-lg inline-block">
                                            <QRCode value={totpUri} size={200} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Or enter this key manually:</h3>
                                        <code className="bg-muted px-2 py-1 rounded text-sm break-all">
                                            {totpUri}
                                        </code>
                                    </div>
                                </div>

                                <form onSubmit={handleVerifyTOTP} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="verify-code">Verify Code</Label>
                                        <Input
                                            id="verify-code"
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            placeholder="000000"
                                            maxLength={6}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Enter the 6-digit code from your authenticator app
                                        </p>
                                    </div>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Verifying..." : "Verify and Complete"}
                                    </Button>
                                </form>

                                {backupCodes.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-semibold mb-2">Backup Codes</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Save these codes in a safe place. Each code can only be used once.
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {backupCodes.map((code, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-muted p-2 rounded"
                                                >
                                                    <code className="text-sm">{code}</code>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(code, index)}
                                                        className="ml-2 p-1 hover:bg-background rounded"
                                                    >
                                                        {copiedIndex === index ? (
                                                            <Check className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>2FA is Enabled</CardTitle>
                            <CardDescription>
                                Your account is protected with two-factor authentication
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleDisable2FA} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="disable-password">Confirm Password</Label>
                                    <Input
                                        id="disable-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <Button type="submit" variant="destructive" disabled={isLoading}>
                                    {isLoading ? "Disabling..." : "Disable 2FA"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Backup Codes</CardTitle>
                            <CardDescription>
                                Generate new backup codes if you've lost access to the old ones
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGenerateBackupCodes}
                                disabled={isLoading}
                            >
                                Generate New Backup Codes
                            </Button>

                            {backupCodes.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold mb-2">Your New Backup Codes</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Save these codes in a safe place. Each code can only be used once.
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {backupCodes.map((code, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-muted p-2 rounded"
                                            >
                                                <code className="text-sm">{code}</code>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(code, index)}
                                                    className="ml-2 p-1 hover:bg-background rounded"
                                                >
                                                    {copiedIndex === index ? (
                                                        <Check className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
