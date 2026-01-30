"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { ChevronRight } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const relevantSegments =
    pathSegments[0] === "admin" ? pathSegments.slice(1) : pathSegments;

  // Traducciones de rutas
  const translateSegment = (segment: string): string => {
    const translations: Record<string, string> = {
      admin: "Dashboard",
      users: "Usuarios",
      sessions: "Sesiones",
      account: "Mi Cuenta",
      settings: "Configuración",
    };
    return translations[segment] || segment;
  };

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-background overflow-hidden">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border/10 bg-background/80 backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4 md:px-6">
          <div className="flex items-center gap-3 flex-1">
            <SidebarTrigger className="-ml-1 hover:bg-sidebar-accent/50 transition-colors" />
            <Separator orientation="vertical" className="h-5 bg-border/30" />
            <Breadcrumb>
              <BreadcrumbList className="flex-wrap gap-1">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="hover:text-foreground transition-colors">
                    <Link href="/admin" className="flex items-center gap-1">
                      <span className="text-sm">Dashboard</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {relevantSegments.length > 0 && (
                  <>
                    <BreadcrumbSeparator>
                      <ChevronRight className="w-4 h-4 text-foreground/40" />
                    </BreadcrumbSeparator>
                    {relevantSegments.map((segment, index) => {
                      const href = `/admin/${relevantSegments
                        .slice(0, index + 1)
                        .join("/")}`;
                      const isLast = index === relevantSegments.length - 1;
                      const translatedSegment = translateSegment(segment);
                      return (
                        <React.Fragment key={href}>
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage className="text-sm font-medium text-foreground">
                                {translatedSegment}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink
                                asChild
                                className="hover:text-foreground transition-colors"
                              >
                                <Link href={href} className="text-sm">
                                  {translatedSegment}
                                </Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!isLast && (
                            <BreadcrumbSeparator>
                              <ChevronRight className="w-4 h-4 text-foreground/40" />
                            </BreadcrumbSeparator>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
