import type { Metadata } from "next";
import { UsersTable } from "@/components/admin/users-table";
import { Users, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Usuarios | Admin Dashboard",
  description: "Gestiona usuarios en el panel de administración",
};

export default function UsersPage() {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-background/95">
      <div className="space-y-6 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-foreground/60 mt-2">Administra y supervisa todos los usuarios del sistema</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-foreground/70">Total de Usuarios</p>
                <p className="text-2xl font-bold text-foreground mt-2">245</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-foreground/70">Activos Hoy</p>
                <p className="text-2xl font-bold text-foreground mt-2">156</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-4 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-foreground/70">Nuevos (7 días)</p>
                <p className="text-2xl font-bold text-foreground mt-2">28</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <UsersTable />
        </Card>
      </div>
    </div>
  );
}
