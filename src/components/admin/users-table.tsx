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

const TABLE_COLUMNS = [
  { label: "Nombre" },
  { label: "Verificación" },
  { label: "Cuentas vinculadas" },
  { label: "Rol" },
  { label: "Estado" },
  { label: "Último acceso" },
  { label: "Creado" },
  { label: "Acciones", className: "w-[80px]" },
];

const SKELETON_ROWS = Array.from({ length: 3 });

const getAccountIcon = (account: string) => {
  switch (account) {
    case "credential":
      return <Mail className="h-4 w-4 text-muted-foreground" />;
    case "github":
      return <GithubIcon className="h-4 w-4 text-muted-foreground" />;
    case "google":
      return <GoogleIcon className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
};

const formatDateSafe = (
  date: string | Date | null | undefined,
  pattern: string,
) => {
  if (!date) return "Nunca";
  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsed.getTime()) ? "Fecha inválida" : format(parsed, pattern);
};

const maskEmail = (email: string) =>
  email.replace(/^[^@]+/, (match) => "*".repeat(match.length));

const getInitialPage = (value: string | null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export function UsersTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [role, setRole] = useState(searchParams.get("role") || "all");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [debouncedEmail, setDebouncedEmail] = useState(email);
  const [page, setPage] = useState(getInitialPage(searchParams.get("page")));

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(email.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (role && role !== "all") params.set("role", role);
    if (debouncedEmail) params.set("email", debouncedEmail);
    params.set("page", String(page));
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
    keepPreviousData: true,
  });

  const users: UserWithDetails[] = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleActionComplete = () => {
    mutate();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
  };

  const currentFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const currentTo = total === 0 ? 0 : (page - 1) * limit + users.length;

  const renderSkeletonRows = () =>
    SKELETON_ROWS.map((_, index) => (
      <TableRow key={index}>
        <TableCell className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[160px]" />
            </div>
          </div>
        </TableCell>
        <TableCell className="px-4 py-4">
          <Skeleton className="h-6 w-[90px]" />
        </TableCell>
        <TableCell className="px-4 py-4">
          <div className="flex -space-x-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
        </TableCell>
        <TableCell className="px-4 py-4">
          <Skeleton className="h-6 w-[70px]" />
        </TableCell>
        <TableCell className="px-4 py-4">
          <Skeleton className="h-4 w-[120px]" />
        </TableCell>
        <TableCell className="px-4 py-4">
          <Skeleton className="h-4 w-[140px]" />
        </TableCell>
        <TableCell className="px-4 py-4">
          <Skeleton className="h-4 w-[140px]" />
        </TableCell>
        <TableCell className="px-4 py-4">
          <Skeleton className="h-8 w-8 rounded-md" />
        </TableCell>
      </TableRow>
    ));

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
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pageNumbers.map((pNum) => (
            <PaginationItem key={pNum}>
              <PaginationLink
                isActive={pNum === page}
                onClick={() => setPage(pNum)}
                className="cursor-pointer"
              >
                {pNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(totalPages)}
                  className="cursor-pointer"
                >
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
                page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const filterControls = (
    <motion.div
      className="mb-3 flex w-full flex-col gap-3 md:flex-row md:items-end md:justify-between"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por email..."
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-[240px]"
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
          <SelectTrigger className="h-10 w-full sm:w-[160px]">
            <span className="flex items-center gap-2">
              {role === "all" ? (
                <Users className="h-4 w-4" />
              ) : role === "admin" ? (
                <Shield className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              {role === "all"
                ? "Todos los roles"
                : role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Todos los roles
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

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-2"
          onClick={() => mutate()}
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="h-10 gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Agregar usuario
        </Button>
      </div>
    </motion.div>
  );

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        No se pudieron cargar los usuarios.
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {filterControls}

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
            <TableRow>
              {TABLE_COLUMNS.map((col) => (
                <TableHead
                  key={col.label}
                  className={[
                    col.className,
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
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
            {isLoading ? (
              renderSkeletonRows()
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold">No se encontraron usuarios</h3>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Prueba cambiando el correo buscado o el filtro de rol.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: UserWithDetails) => (
                <TableRow
                  key={user.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {maskEmail(user.email)}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    {user.verified ? (
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1 border-border bg-muted px-2 py-1 text-xs text-foreground"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Verificado
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1 border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                      >
                        <XCircle className="h-3 w-3" />
                        No verificado
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    {user.accounts?.length ? (
                      <div className="flex -space-x-2">
                        {user.accounts.map((account) => (
                          <div
                            key={account}
                            className="rounded-full border bg-muted p-1.5"
                            title={account}
                          >
                            {getAccountIcon(account)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin cuentas</span>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={`flex w-fit items-center gap-1 px-2 py-1 text-xs ${
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

                  <TableCell className="px-4 py-4">
                    {user.banned ? (
                      <div className="flex flex-col gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="flex w-fit cursor-help items-center gap-1 border-foreground/30 bg-foreground/10 px-2 py-1 text-xs text-foreground"
                            >
                              <Ban className="h-3 w-3" />
                              Bloqueado
                            </Badge>
                          </TooltipTrigger>
                          {user.banReason && (
                            <TooltipContent>
                              Motivo: {user.banReason}
                            </TooltipContent>
                          )}
                        </Tooltip>

                        {user.banExpires && (
                          <span className="text-xs text-muted-foreground">
                            Expira: {formatDateSafe(user.banExpires, "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex w-fit items-center gap-1 border-border bg-muted px-2 py-1 text-xs text-foreground"
                      >
                        <Check className="h-3 w-3" />
                        Activo
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-4 text-xs text-muted-foreground">
                    {formatDateSafe(user.lastSignIn, "MMM d, yyyy 'a las' h:mm a")}
                  </TableCell>

                  <TableCell className="px-4 py-4 text-xs text-muted-foreground">
                    {formatDateSafe(user.createdAt, "MMM d, yyyy 'a las' h:mm a")}
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <UserActions
                      user={user}
                      onActionComplete={handleActionComplete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 px-1 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {currentFrom}-{currentTo} de {total} usuarios
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