import type { ReactNode } from "react";

// Layout spécifique pour la page d'inscription organisateur
// Ce layout override le layout admin parent pour permettre l'accès sans authentification
export default function OrganizerRegisterLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Ce layout ne fait rien de spécial, il laisse juste passer les enfants
  // Le middleware gère déjà l'authentification pour cette route
  return <>{children}</>;
}

