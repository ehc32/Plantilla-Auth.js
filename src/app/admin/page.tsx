import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "Panel de control del administrador",
};

export default function AdminPage() {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-background/95">
      <AdminDashboard />
    </div>
  );
}
