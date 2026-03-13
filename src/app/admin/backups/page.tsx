"use client";

import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { Database, Download, RefreshCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type BackupSummary = {
  generatedAt: string;
  totals: {
    users: number;
    sessions: number;
    accounts: number;
  };
  cappedExport: number;
};

export default function AdminBackupsPage() {
  const { data, isLoading, error, mutate } = useSWR<BackupSummary>(
    "/api/admin/backup?mode=summary",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  const formatDate = useMemo(
    () =>
      new Intl.DateTimeFormat("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/backup?mode=full");
      if (!res.ok) {
        throw new Error("No se pudo generar el backup");
      }

      const payload = await res.json();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      anchor.href = url;
      anchor.download = `backup-admin-${stamp}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Backup generado y descargado");
    } catch (downloadError) {
      console.error(downloadError);
      toast.error("No se pudo descargar el backup");
    }
  }, []);

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Error al cargar estado de backups.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Backups</h1>
          <p className="mt-2 text-foreground/60">
            Consola de respaldo para exportar instantáneas del sistema admin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-5 border-border/60 bg-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Usuarios</p>
              <Database className="h-4 w-4 text-foreground/70" />
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {isLoading ? "..." : (data?.totals.users ?? 0)}
            </p>
          </Card>
          <Card className="p-5 border-border/60 bg-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Sesiones</p>
              <ShieldCheck className="h-4 w-4 text-foreground/70" />
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {isLoading ? "..." : (data?.totals.sessions ?? 0)}
            </p>
          </Card>
          <Card className="p-5 border-border/60 bg-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Cuentas</p>
              <Database className="h-4 w-4 text-foreground/70" />
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {isLoading ? "..." : (data?.totals.accounts ?? 0)}
            </p>
          </Card>
        </div>

        <Card className="p-6 border-border/60 bg-card space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Respaldo estable</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Exporta un snapshot JSON de usuarios, sesiones y cuentas (límite
              de {data?.cappedExport ?? 5000} registros por tabla) para
              recuperación operativa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar backup
            </Button>
            <Button
              variant="outline"
              onClick={() => mutate()}
              className="gap-2"
              disabled={isLoading}
            >
              <RefreshCcw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Actualizar estado
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Última lectura:{" "}
            {data?.generatedAt
              ? formatDate.format(new Date(data.generatedAt))
              : "sin datos"}
          </p>
        </Card>
      </div>
    </div>
  );
}
