"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Settings,
    Shield,
    Database,
    Mail,
    Globe,
    Lock,
    Save
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings saved successfully");
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage system parameters, credentials, and global configuration.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* System Parameters Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                <CardTitle>System Parameters</CardTitle>
                            </div>
                            <CardDescription>
                                General configuration for the application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="app-name">Application Name</Label>
                                <Input id="app-name" defaultValue="Zexa Better Auth Starter" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="support-email">Support Email</Label>
                                <Input id="support-email" type="email" defaultValue="help@zexa.app" />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Disable access for non-admin users.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Public Registration</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow new users to sign up.
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                <CardTitle>Database & Storage</CardTitle>
                            </div>
                            <CardDescription>
                                Configuration for data persistence (Read-only).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Database Provider</Label>
                                <Input value="PostgreSQL" disabled readOnly className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label>ORM Version</Label>
                                <Input value="Drizzle v0.30.0" disabled readOnly className="bg-muted" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Credentials & Security Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                <CardTitle>Credentials & Integrations</CardTitle>
                            </div>
                            <CardDescription>
                                Manage API keys and external service connections.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Google Client ID</Label>
                                    <div className="flex gap-2">
                                        <Input type="password" value="************************" readOnly />
                                        <Button variant="outline" size="sm">Update</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>GitHub Client ID</Label>
                                    <div className="flex gap-2">
                                        <Input type="password" value="************************" readOnly />
                                        <Button variant="outline" size="sm">Update</Button>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-2" />
                            <div className="space-y-2">
                                <Label>Stripe Secret Key</Label>
                                <Input type="password" placeholder="sk_live_..." />
                            </div>
                            <div className="space-y-2">
                                <Label>OpenAI API Key</Label>
                                <Input type="password" placeholder="sk-..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                <CardTitle>SMTP Configuration</CardTitle>
                            </div>
                            <CardDescription>
                                Email server settings for system notifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Host</Label>
                                    <Input placeholder="smtp.resend.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Port</Label>
                                    <Input placeholder="587" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Username</Label>
                                <Input placeholder="resend" />
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input type="password" value="re_123456789" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={loading} className="min-w-[120px]">
                    {loading ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
