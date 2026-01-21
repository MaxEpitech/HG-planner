import { redirect } from "@/i18n/routing";
import { headers } from "next/headers";
import { AdminShell } from "@/components/layout/admin-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { GLOBAL_ROLES_WITH_LABELS, canAccessAdminPanel } from "@/lib/auth/roles";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  // Vérifier si on est sur la page d'inscription (route publique)
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  
  // Si c'est la page d'inscription, on laisse passer sans authentification
  if (pathname.includes("/admin/inscription")) {
    return <>{children}</>;
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  // Security: Block athletes from accessing admin area
  if (!user || !canAccessAdminPanel(user.role)) {
    redirect({ href: "/athlete", locale });
    return null; 
  }

  const activeRole = GLOBAL_ROLES_WITH_LABELS.find((r) => r.value === user.role);

  if (!activeRole) {
    redirect({ href: "/login", locale });
    return null;
  }

  return <AdminShell role={activeRole}>{children}</AdminShell>;
}

