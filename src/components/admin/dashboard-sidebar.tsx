"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  Shield,
  User,
  BarChart3,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/mode-toggle";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const sidebarNavItems = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
    group: "principal",
  },
  {
    href: "/admin/users",
    icon: Users,
    label: "Usuarios",
    group: "gestión",
  },
  {
    href: "/admin/sessions",
    icon: Shield,
    label: "Sesiones",
    group: "gestión",
  },
  {
    href: "/admin/settings",
    icon: Settings,
    label: "Configuración",
    group: "sistema",
  },
  {
    href: "/admin/account",
    icon: User,
    label: "Mi Cuenta",
    group: "sistema",
  },
  {
    href: "/admin/backups",
    icon: Database,
    label: "Backups",
    group: "sistema",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = authClient;

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const principalItems = sidebarNavItems.filter(
    (item) => item.group === "principal",
  );
  const gestionItems = sidebarNavItems.filter(
    (item) => item.group === "gestión",
  );
  const sistemaItems = sidebarNavItems.filter(
    (item) => item.group === "sistema",
  );

  return (
    <Sidebar collapsible="offcanvas" variant="inset" className="bg-sidebar">
      <SidebarHeader className="border-b border-border/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-sidebar-accent"
            >
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-primary text-sidebar-primary-foreground">
                  <BarChart3 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-sm">Admin</span>
                  <span className="text-xs text-foreground/50">Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="space-y-4 py-4">
        {/* Principal */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {principalItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="relative transition-all duration-200 data-[active=true]:bg-sidebar-accent"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Gestión */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">
            Gestión
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gestionItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="relative transition-all duration-200 data-[active=true]:bg-sidebar-accent"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sistema */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sistemaItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="relative transition-all duration-200 data-[active=true]:bg-sidebar-accent"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/20">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between px-2 py-2">
            <span className="text-xs font-semibold text-foreground/50">
              TEMA
            </span>
            <ModeToggle />
          </SidebarMenuItem>
          <SidebarSeparator className="my-2 bg-border/20" />
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Cerrar sesión"
              className="cursor-pointer text-foreground/70 hover:text-foreground hover:bg-sidebar-accent transition-colors"
            >
              <button onClick={handleLogout} className="w-full">
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
