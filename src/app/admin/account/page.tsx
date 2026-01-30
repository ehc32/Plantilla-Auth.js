"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import {
    Loader2,
    Monitor,
    Smartphone,
    Globe,
    Trash2,
    Save,
    User,
    Shield,
    Clock,
    Fingerprint,
    Plus,
    Laptop,
    LogOut,
    Key,
    ChevronRight,
    Home,
    Settings,
    HomeIcon,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import TwoFactorSettings from "@/components/auth/two-factor-settings";

const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Globe className="h-4 w-4" />;
    if (userAgent.toLowerCase().includes("mobile"))
        return <Smartphone className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
};

const getDeviceName = (userAgent: string | null) => {
    if (!userAgent) return "Unknown Device";
    if (userAgent.includes("Windows")) return "Windows PC";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("iPhone")) return "iPhone";
    if (userAgent.includes("Android")) return "Android";
    return "Unknown Device";
};

export default function AdminAccountPage() {
    const router = useRouter();
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    
    // Return wrapper component for styling consistency
    const PageWrapper = ({ children }: { children: React.ReactNode }) => (
        <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-background/95">
            <div className="space-y-6 p-4 md:p-8">
                {children}
            </div>
        </div>
    );

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [passkeys, setPasskeys] = useState<any[]>([]);
    const [loadingPasskeys, setLoadingPasskeys] = useState(true);

    // Passkey dialog state
    const [isPasskeyDialogOpen, setIsPasskeyDialogOpen] = useState(false);
    const [passkeyName, setPasskeyName] = useState("");
    const [creatingPasskey, setCreatingPasskey] = useState(false);

    // Initialize name from session
    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    // Fetch user's active sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const { data } = await authClient.listSessions();
                if (data) setSessions(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingSessions(false);
            }
        };
        if (session) fetchSessions();
    }, [session]);

    // Fetch user's passkeys
    useEffect(() => {
        const fetchPasskeys = async () => {
            try {
                // @ts-ignore - passkey plugin
                const { data } = await authClient.passkey.listUserPasskeys();
                if (data) setPasskeys(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingPasskeys(false);
            }
        };
        if (session) fetchPasskeys();
    }, [session]);

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        setSaving(true);
        try {
            await authClient.updateUser({ name: name.trim() });
            toast.success("Profile updated", {
                description: "Your information has been saved successfully.",
            });
        } catch (error) {
            toast.error("Update failed", {
                description: "There was a problem saving your profile. Please try again.",
            });
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleRevokeSession = async (token: string, isCurrentSession: boolean) => {
        try {
            await authClient.revokeSession({ token });

            if (isCurrentSession) {
                toast.success("Identity Secured", {
                    description: "Current session revoked. Redirecting to security gateway...",
                });
                await authClient.signOut();
                router.push("/auth/login");
            } else {
                setSessions((prev) => prev.filter((s) => s.token !== token));
                toast.success("Session Terminated", {
                    description: "The remote device has been successfully signed out.",
                });
            }
        } catch (e) {
            toast.error("Action Failed", {
                description: "Could not revoke the session. Please check your connection.",
            });
            console.error(e);
        }
    };

    const handleAddPasskey = async () => {
        if (!passkeyName.trim()) {
            toast.error("Please enter a name for your passkey");
            return;
        }
        setCreatingPasskey(true);
        try {
            // @ts-ignore - passkey plugin
            await authClient.passkey.addPasskey({
                name: passkeyName.trim(),
            });
            toast.success("Security Key Added", {
                description: `"${passkeyName.trim()}" is now registered for passwordless sign-in.`,
            });
            // Refresh passkeys list
            // @ts-ignore
            const { data } = await authClient.passkey.listUserPasskeys();
            if (data) setPasskeys(data);
            setIsPasskeyDialogOpen(false);
            setPasskeyName("");
        } catch (error: any) {
            toast.error("Registration Failed", {
                description: error?.message || "Verify your security key device and try again.",
            });
            console.error(error);
        } finally {
            setCreatingPasskey(false);
        }
    };

    const handleDeletePasskey = async (id: string) => {
        try {
            // @ts-ignore - passkey plugin
            await authClient.passkey.deletePasskey({ id });
            setPasskeys((prev) => prev.filter((p) => p.id !== id));
            toast.success("Security Key Removed", {
                description: "This key can no longer be used to access your account.",
            });
        } catch (error) {
            toast.error("Removal Error", {
                description: "The security key could not be removed at this time.",
            });
            console.error(error);
        }
    };

    if (sessionLoading) {
        return (
            <div className="flex justify-center items-center p-8 min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex justify-center items-center p-8 min-h-[400px]">
                <p className="text-muted-foreground">Access denied</p>
            </div>
        );
    }

    return (
        <PageWrapper>
            {/* Top Navigation / Breadcrumbs */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-foreground">Mi Cuenta</h1>
                    <p className="text-foreground/60">Gestiona tu información personal y seguridad</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
                    <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Cambios
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="border-none shadow-none bg-transparent">
                {/* Banner Image */}
                <div className="relative h-32 md:h-40 w-full rounded-3xl overflow-hidden shadow-sm">
                    <Image
                        src="/banner.webp"
                        alt="Profile Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <CardContent className="px-0 pb-8">
                    {/* Profile Header (Avatar overlap) */}
                    <div className="relative -mt-12 mb-2 flex flex-col items-center">
                        <div className="relative h-24 w-24 rounded-full border-4 border-background bg-background shadow-md overflow-hidden">
                            <Avatar className="h-full w-full">
                                <AvatarImage src={session.user.image || ""} />
                                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                                    {session.user.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="mt-2 text-center space-y-1">
                            <h2 className="text-xl font-bold">{session.user.name}</h2>
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <span>{session.user.email}</span>
                                <Badge variant="secondary" className="font-normal text-[10px] uppercase tracking-wider h-5 px-1.5">
                                    {session.user.role || "User"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 mt-6">
                        <div className="space-y-3 bg-card p-5 rounded-lg border shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-base">Personal Information</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name" className="text-xs">Display Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your display name"
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label className="text-xs">Email Address</Label>
                                    <Input
                                        value={session.user.email || ""}
                                        disabled
                                        className="bg-muted text-muted-foreground h-8 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 bg-card p-5 rounded-lg border shadow-sm">
                            <h3 className="font-medium text-base">Account Status</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 border rounded-lg bg-background/50 flex flex-col justify-center">
                                    <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Account Type</div>
                                    <div className="font-medium capitalize flex items-center gap-1.5 text-sm">
                                        {session.user.role || "Standard"}
                                        {session.user.role === "admin" && <Shield className="h-3 w-3 text-primary" />}
                                    </div>
                                </div>
                                <div className="p-3 border rounded-lg bg-background/50 flex flex-col justify-center">
                                    <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Member Since</div>
                                    <div className="font-medium text-sm">
                                        {format(new Date(session.user.createdAt), "MMM yyyy")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                        {/* Active Sessions */}
                        <div className="space-y-3 bg-card p-5 rounded-lg border shadow-sm flex flex-col">
                            <div className="flex items-center justify-between">
                                <h4 className="text-base font-medium flex items-center gap-2">
                                    <Laptop className="h-4 w-4" /> Active Sessions
                                </h4>
                            </div>
                            <div className="border rounded-lg overflow-hidden flex-1">
                                {loadingSessions ? (
                                    <div className="p-4 space-y-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {sessions.map((s) => (
                                            <div key={s.id} className="p-3 flex items-center justify-between bg-card hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-muted rounded-full">
                                                        {getDeviceIcon(s.userAgent)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium flex items-center gap-2">
                                                            {getDeviceName(s.userAgent)}
                                                            {s.id === session.session.id && (
                                                                <Badge variant="outline" className="text-[10px] py-0 h-4 border-primary text-primary">Current</Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {s.ipAddress} • {formatDistanceToNow(new Date(s.expiresAt), { addSuffix: true })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleRevokeSession(s.token, s.id === session.session.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {sessions.length === 0 && (
                                            <div className="p-8 text-center text-sm text-muted-foreground">
                                                No sessions found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Passkeys */}
                        <div className="space-y-3 bg-card p-5 rounded-lg border shadow-sm flex flex-col">
                            <div className="flex items-center justify-between">
                                <h4 className="text-base font-medium flex items-center gap-2">
                                    <Fingerprint className="h-4 w-4" /> Passkeys
                                </h4>
                                <Dialog open={isPasskeyDialogOpen} onOpenChange={setIsPasskeyDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="h-7 text-xs rounded-full">
                                            <Plus className="mr-1 h-3 w-3" /> Add
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Passkey</DialogTitle>
                                            <DialogDescription>
                                                Name your passkey to identify it later.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <Label>Passkey Name</Label>
                                            <Input
                                                value={passkeyName}
                                                onChange={(e) => setPasskeyName(e.target.value)}
                                                placeholder="e.g. My iPhone"
                                                className="mt-2"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="ghost" onClick={() => setIsPasskeyDialogOpen(false)}>Cancel</Button>
                                            <Button onClick={handleAddPasskey} disabled={creatingPasskey}>
                                                {creatingPasskey && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Create
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                {loadingPasskeys ? (
                                    <div className="p-4 space-y-4">
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {passkeys.map((pk) => (
                                            <div key={pk.id} className="p-3 flex items-center justify-between bg-card hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-full">
                                                        <Fingerprint className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {pk.name || "Unnamed Passkey"}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Added {format(new Date(pk.createdAt), "MMM d, yyyy")}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDeletePasskey(pk.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {passkeys.length === 0 && (
                                            <div className="p-8 text-center text-sm text-muted-foreground">
                                                No passkeys configured
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Two-Factor Authentication Section */}
                    <div className="mt-4">
                        <div className="bg-card p-5 rounded-lg border shadow-sm">
                            <TwoFactorSettings
                                currentUser={{
                                    twoFactorEnabled: session.user.twoFactorEnabled || false,
                                    email: session.user.email
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
