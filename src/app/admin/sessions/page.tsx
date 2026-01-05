"use client";

import {
    Search,
    Monitor,
    Smartphone,
    Globe,
    Trash2,
    Clock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import useSWR from "swr";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

type SessionWithUser = {
    id: string;
    token: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
    ipAddress: string | null;
    userAgent: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        role: string;
    } | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

export default function AdminSessionsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [debouncedEmail, setDebouncedEmail] = useState(email);
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const limit = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedEmail(email);
        }, 300);
        return () => clearTimeout(timer);
    }, [email]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedEmail) params.set("email", debouncedEmail);
        if (page) params.set("page", String(page));
        params.set("limit", String(limit));
        router.replace(`?${params.toString()}`);
    }, [debouncedEmail, page, router]);

    const swrKey = useMemo(() => {
        const params = new URLSearchParams();
        if (debouncedEmail) params.set("email", debouncedEmail);
        params.set("page", String(page));
        params.set("limit", String(limit));
        return `/api/admin/sessions?${params.toString()}`;
    }, [debouncedEmail, page, limit]);

    const { data, error, mutate, isLoading } = useSWR<SessionWithUser[]>(
        swrKey,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 2000,
        }
    );

    const handleRevoke = async (sessionToken: string) => {
        try {
            // @ts-ignore - admin plugin types might be partial
            await authClient.admin.revokeSession({ sessionToken });
            toast.success("Session revoked");
            mutate();
        } catch (error) {
            toast.error("Failed to revoke session");
            console.error(error);
        }
    };

    const sessions = data || [];
    const total = sessions.length;
    const totalPages = Math.ceil(total / limit);

    const filterControls = (
        <div className="flex flex-wrap gap-2 items-end mb-2 w-full justify-between">
            <div className="flex gap-2 items-end">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by email..."
                        className="pl-8 pr-2 py-2 border rounded-md text-sm bg-background w-[200px]"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>
            <div className="text-sm text-muted-foreground">
                {total} active session{total !== 1 ? "s" : ""}
            </div>
        </div>
    );

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, page - 2);
        let endPage = Math.min(totalPages, page + 2);
        if (endPage - startPage < maxPagesToShow - 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return (
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            aria-disabled={page === 1}
                            tabIndex={page === 1 ? -1 : 0}
                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {startPage > 1 && (
                        <>
                            <PaginationItem>
                                <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
                            </PaginationItem>
                            {startPage > 2 && <PaginationEllipsis />}
                        </>
                    )}
                    {pageNumbers.map((pNum) => (
                        <PaginationItem key={pNum}>
                            <PaginationLink
                                isActive={pNum === page}
                                onClick={() => setPage(pNum)}
                            >
                                {pNum}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <PaginationEllipsis />}
                            <PaginationItem>
                                <PaginationLink onClick={() => setPage(totalPages)}>
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            aria-disabled={page === totalPages}
                            tabIndex={page === totalPages ? -1 : 0}
                            className={
                                page === totalPages ? "pointer-events-none opacity-50" : ""
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
    };

    if (error) return <div>Failed to load sessions</div>;

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Global Sessions</h1>
                <p className="text-muted-foreground">
                    Monitor and manage all active sessions across the platform.
                </p>
            </div>

            <div className="space-y-4">
                {filterControls}
                <div className="overflow-hidden rounded-lg border-muted border-2">
                    <Table className="text-sm">
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                {[
                                    { label: "User" },
                                    { label: "Device" },
                                    { label: "IP Address" },
                                    { label: "Created" },
                                    { label: "Expires" },
                                    { label: "Status" },
                                    { label: "Actions", className: "w-[80px]" },
                                ].map((col) => (
                                    <TableHead
                                        key={col.label}
                                        className={[
                                            col.className,
                                            "px-4 py-3 text-xs font-medium text-muted-foreground",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        {col.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-[120px]" />
                                                    <Skeleton className="h-3 w-[160px]" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Skeleton className="h-6 w-[100px]" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Skeleton className="h-4 w-[100px]" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Skeleton className="h-4 w-[80px]" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Skeleton className="h-4 w-[80px]" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Skeleton className="h-6 w-[60px]" />
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))
                                : sessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={session.user?.image || ""}
                                                        alt={session.user?.name || ""}
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        {session.user?.name
                                                            ?.substring(0, 2)
                                                            .toUpperCase() || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {session.user?.name || "Unknown User"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {session.user?.email || "No email"}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-muted rounded-full">
                                                    {getDeviceIcon(session.userAgent)}
                                                </div>
                                                <span className="text-sm">
                                                    {getDeviceName(session.userAgent)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {session.ipAddress || "Unknown"}
                                            </code>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {formatDistanceToNow(new Date(session.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {format(
                                                        new Date(session.createdAt),
                                                        "MMM d, yyyy 'at' h:mm a"
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                                            <Tooltip>
                                                <TooltipTrigger className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDistanceToNow(new Date(session.expiresAt), {
                                                        addSuffix: true,
                                                    })}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {format(
                                                        new Date(session.expiresAt),
                                                        "MMM d, yyyy 'at' h:mm a"
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700 flex items-center gap-1 px-2 py-1 text-xs"
                                            >
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleRevoke(session.token)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Revoke Session</TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                    <div className="text-sm text-muted-foreground">
                        Showing {sessions.length} of {total} sessions
                    </div>
                    {renderPagination()}
                </div>
            </div>
        </div>
    );
}
