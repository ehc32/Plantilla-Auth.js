"use client";

import {
  CheckCircle,
  XCircle,
  Mail,
  Ban,
  Check,
  Search,
  Users,
  User,
  UserPlus,
  RefreshCcw,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import useSWR from "swr";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
import { UserWithDetails } from "@/utils/users";
import { GithubIcon, GoogleIcon } from "../ui/icons";
import { UserActions } from "./user-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { UserAddDialog } from "./user-add-dialog";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const getAccountIcon = (account: string) => {
  switch (account) {
    case "credential":
      return <Mail className="h-4 w-4 dark:text-neutral-300" />;
    case "github":
      return <GithubIcon className="h-4 w-4 dark:text-neutral-300" />;
    case "google":
      return <GoogleIcon className="h-4 w-4 dark:text-neutral-300" />;
    default:
      return null;
  }
};

const formatDateSafe = (date: string | Date | null | undefined, pattern: string) => {
  if (!date) return "Never";
  const parsed = date instanceof Date ? date : new Date(date);
  return isNaN(parsed.getTime()) ? "Invalid date" : format(parsed, pattern);
};

export function UsersTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [role, setRole] = useState(searchParams.get("role") || "all");
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

    if (role && role !== "all") params.set("role", role);
    if (debouncedEmail) params.set("email", debouncedEmail);
    if (page) params.set("page", String(page));
    params.set("limit", String(limit));

    router.replace(`?${params.toString()}`);
  }, [role, debouncedEmail, page, router]);

  const swrKey = useMemo(() => {
    const params = new URLSearchParams();

    if (role && role !== "all") params.set("role", role);
    if (debouncedEmail) params.set("email", debouncedEmail);
    params.set("page", String(page));
    params.set("limit", String(limit));

    return `/api/admin/users?${params.toString()}`;
  }, [role, debouncedEmail, page]);

  const { data, error, mutate, isLoading } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  const handleActionComplete = () => {
    mutate();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
  };

  const filterControls = (
    <motion.div
      className="mb-2 flex w-full flex-wrap items-end justify-between gap-2"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
    >
      <div className="flex items-end gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search email..."
            className="w-[200px] rounded-md border bg-background py-2 pl-8 pr-2 text-sm"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="flex w-[140px] items-center gap-2">
            <span className="flex items-center gap-2">
              {role === "all" ? (
                <Users className="h-4 w-4" />
              ) : role === "admin" ? (
                <Shield className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              {role === "all"
                ? "All Roles"
                : role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                All Roles
              </span>
            </SelectItem>
            <SelectItem value="admin">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </span>
            </SelectItem>
            <SelectItem value="user">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                User
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1"
          onClick={() => mutate()}
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          Add a user
        </Button>
      </div>
    </motion.div>
  );

  if (error) {
    return <div>Failed to load users</div>;
  }

  if (!data) {
    return (
      <div className="space-y-4 border-accent-foreground">
        {filterControls}
        <div className="overflow-hidden">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                {[
                  { label: "Name" },
                  { label: "Verification" },
                  { label: "Linked Accounts" },
                  { label: "Role" },
                  { label: "Status" },
                  { label: "Last Sign In" },
                  { label: "Created At" },
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
              {Array.from({ length: 3 }).map((_, index) => (
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
                    <Skeleton className="h-6 w-[80px]" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex -space-x-2">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-full" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-6 w-[60px]" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  const { users = [], total = 0, totalPages = 0 } = data;

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers: number[] = [];
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
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {filterControls}

      <div className="overflow-hidden rounded-lg border-2 border-muted">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              {[
                { label: "Name" },
                { label: "Verification" },
                { label: "Linked Accounts" },
                { label: "Role" },
                { label: "Status" },
                { label: "Last Sign In" },
                { label: "Created At" },
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
              ? Array.from({ length: 3 }).map((_, index) => (
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
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-8 rounded-full" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-6 w-[60px]" />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-[140px]" />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-4 w-[140px]" />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              : users.map((user: UserWithDetails) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email.replace(/^[^@]+/, (match) =>
                              "*".repeat(match.length)
                            )}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      {user.verified ? (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-border bg-muted px-2 py-1 text-xs text-foreground"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                        >
                          <XCircle className="h-3 w-3" />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex -space-x-2">
                        {user.accounts.map((account) => (
                          <div
                            key={account}
                            className="rounded-full bg-muted p-1.5 text-muted-foreground dark:bg-neutral-700"
                            title={account}
                          >
                            {getAccountIcon(account)}
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 px-2 py-1 text-xs ${
                          user.role === "admin"
                            ? "border-border bg-muted text-foreground"
                            : "border-border bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        {user.role
                          ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                          : "User"}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      {user.banned ? (
                        <div className="flex flex-col gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="cursor-help border-foreground/30 bg-foreground/10 px-2 py-1 text-xs text-foreground"
                              >
                                <Ban className="h-3 w-3" />
                                Banned
                              </Badge>
                            </TooltipTrigger>
                            {user.banReason && (
                              <TooltipContent>
                                Reason: {user.banReason}
                              </TooltipContent>
                            )}
                          </Tooltip>

                          {user.banExpires && (
                            <span className="text-xs text-muted-foreground">
                              Expires: {formatDateSafe(user.banExpires, "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 border-border bg-muted px-2 py-1 text-xs text-foreground"
                        >
                          <Check className="h-3 w-3" />
                          Active
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDateSafe(user.lastSignIn, "MMM d, yyyy 'at' h:mm a")}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDateSafe(user.createdAt, "MMM d, yyyy 'at' h:mm a")}
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <UserActions
                        user={user}
                        onActionComplete={handleActionComplete}
                      />
                    </TableCell>
                  </motion.tr>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-1">
        <div className="text-sm text-muted-foreground">
          Showing {users.length} of {total} users
        </div>
        {renderPagination()}
      </div>

      <UserAddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={() => mutate()}
      />
    </motion.div>
  );
}