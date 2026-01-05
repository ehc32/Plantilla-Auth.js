"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError, FormSuccess } from "@/components/ui/form-messages";
import { Shield, Copy, Check, ChevronDown, ChevronUp, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { Badge } from "@/components/ui/badge";

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
    const [showSetup, setShowSetup] = useState(false);
    const [showBackupCodes, setShowBackupCodes] = useState(false);

    const handleEnable2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const { data, error } = await authClient.twoFactor.enable({ password });

            if (error) {
                setError(error.message || "Failed to enable 2FA");
            } else if (data) {
                setTotpUri(data.totpURI);
                setBackupCodes(data.backupCodes || []);
                setShowSetup(true);
                setSuccess("Scan the QR code with your authenticator app");
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
            const { data, error } = await authClient.twoFactor.disable({ password });

            if (error) {
                setError(error.message || "Failed to disable 2FA");
            } else {
                setSuccess("2FA has been disabled");
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
            const { data, error } = await authClient.twoFactor.verifyTotp({ code: verificationCode });

            if (error) {
                setError(error.message || "Invalid code");
            } else {
                setSuccess("2FA enabled successfully!");
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
            const { data, error } = await authClient.twoFactor.generateBackupCodes({ password: pwd });

            if (error) {
                setError(error.message || "Failed to generate backup codes");
            } else if (data) {
                setBackupCodes(data.backupCodes || []);
                setShowBackupCodes(true);
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
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-base">Two-Factor Authentication</h3>
                    {currentUser.twoFactorEnabled && (
                        <Badge variant="secondary" className="text-xs">Enabled</Badge>
                    )}
                </div>
            </div>

            <FormSuccess message={success} />
            <FormError message={error} />

            {!currentUser.twoFactorEnabled ? (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                    </p>

                    {!showSetup ? (
                        <form onSubmit={handleEnable2FA} className="space-y-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-xs">Confirm Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="h-8 text-sm"
                                />
                            </div>
                            <Button type="submit" size="sm" disabled={isLoading} className="h-8 text-xs">
                                {isLoading ? "Enabling..." : "Enable 2FA"}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="bg-white p-3 rounded-lg border">
                                    <QRCode value={totpUri} size={140} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                        Scan this QR code with Google Authenticator, Authy, or any TOTP app
                                    </p>
                                    <div className="bg-muted p-2 rounded text-[10px] font-mono break-all">
                                        {totpUri}
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleVerifyTOTP} className="space-y-3">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="verify-code" className="text-xs">Enter Code to Verify</Label>
                                    <Input
                                        id="verify-code"
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="h-8 text-sm text-center tracking-widest"
                                    />
                                </div>
                                <Button type="submit" size="sm" disabled={isLoading || verificationCode.length !== 6} className="h-8 text-xs">
                                    {isLoading ? "Verifying..." : "Verify & Complete"}
                                </Button>
                            </form>

                            {backupCodes.length > 0 && (
                                <div className="border rounded-lg p-3 bg-amber-50 dark:bg-amber-950/20">
                                    <p className="text-xs font-semibold mb-2 flex items-center gap-1">
                                        ⚠️ Save Your Backup Codes
                                    </p>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Store these codes safely. Each can only be used once.
                                    </p>
                                    <div className="grid grid-cols-2 gap-1">
                                        {backupCodes.map((code, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-background p-1.5 rounded text-xs font-mono"
                                            >
                                                <span>{code}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(code, index)}
                                                    className="p-1 hover:bg-muted rounded"
                                                >
                                                    {copiedIndex === index ? (
                                                        <Check className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-3 w-3" />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="border rounded-lg p-3 bg-background/50">
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
                        </div>
                        <div className="border rounded-lg p-3 bg-background/50">
                            <p className="text-xs text-muted-foreground mb-1">Method</p>
                            <p className="text-sm font-medium">TOTP</p>
                        </div>
                    </div>

                    {/* Backup Codes Section */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowBackupCodes(!showBackupCodes)}
                            className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <span className="text-sm font-medium">Backup Codes</span>
                            {showBackupCodes ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>

                        {showBackupCodes && (
                            <div className="mt-2 p-3 border rounded-lg bg-muted/30 space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    Generate new backup codes if you've lost access to the old ones
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerateBackupCodes}
                                    disabled={isLoading}
                                    className="h-7 text-xs"
                                >
                                    Generate New Codes
                                </Button>

                                {backupCodes.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs font-semibold">Your New Backup Codes:</p>
                                        <div className="grid grid-cols-2 gap-1">
                                            {backupCodes.map((code, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-background p-1.5 rounded text-xs font-mono"
                                                >
                                                    <span>{code}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(code, index)}
                                                        className="p-1 hover:bg-muted rounded"
                                                    >
                                                        {copiedIndex === index ? (
                                                            <Check className="h-3 w-3 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Disable 2FA */}
                    <form onSubmit={handleDisable2FA} className="space-y-3 p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                        <p className="text-xs font-semibold text-destructive">Disable Two-Factor Authentication</p>
                        <div className="grid gap-1.5">
                            <Label htmlFor="disable-password" className="text-xs">Confirm Password</Label>
                            <Input
                                id="disable-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="h-8 text-sm"
                            />
                        </div>
                        <Button type="submit" variant="destructive" size="sm" disabled={isLoading} className="h-7 text-xs">
                            {isLoading ? "Disabling..." : "Disable 2FA"}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
