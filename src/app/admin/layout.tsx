import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AdminShell } from "@/components/layout/admin-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { GLOBAL_ROLES_WITH_LABELS } from "@/lib/auth/roles";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Vérifier si on est sur la page d'inscription (route publique)
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  
  // Si c'est la page d'inscription, on laisse passer sans authentification
  if (pathname.includes("/admin/inscription")) {
    return <>{children}</>;
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const activeRole = GLOBAL_ROLES_WITH_LABELS.find((r) => r.value === user.role);

  if (!activeRole) {
    redirect("/login");
  }

  return <AdminShell role={activeRole}>{children}</AdminShell>;
}

