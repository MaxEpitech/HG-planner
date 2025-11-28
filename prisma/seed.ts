import { PrismaClient, GlobalRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL manquant pour le seed");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Démarrage du seed...");

  // Créer un utilisateur organisateur de test
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const organisateur = await prisma.user.upsert({
    where: { email: "organisateur@test.com" },
    update: {},
    create: {
      email: "organisateur@test.com",
      passwordHash: hashedPassword,
      firstName: "Jean",
      lastName: "Dupont",
      role: GlobalRole.ORGANISATEUR,
      isApproved: true, // Approuvé par défaut pour les comptes de test
    },
  });

  console.log("✅ Utilisateur organisateur créé:", organisateur.email);

  // Créer un utilisateur directeur athlétique de test
  const directeur = await prisma.user.upsert({
    where: { email: "directeur@test.com" },
    update: {},
    create: {
      email: "directeur@test.com",
      passwordHash: hashedPassword,
      firstName: "Marie",
      lastName: "Martin",
      role: GlobalRole.DIRECTEUR_ATHLETIQUE,
      isApproved: true, // Approuvé par défaut pour les comptes de test
    },
  });

  console.log("✅ Utilisateur directeur athlétique créé:", directeur.email);

  // Créer un utilisateur admin plateforme de test
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      passwordHash: hashedPassword,
      firstName: "Admin",
      lastName: "Système",
      role: GlobalRole.PLATFORM_ADMIN,
      isApproved: true, // Les admins sont toujours approuvés
    },
  });

  console.log("✅ Utilisateur admin plateforme créé:", admin.email);

  // Créer un utilisateur athlète de test
  const athleteUser = await prisma.user.upsert({
    where: { email: "athlete@test.com" },
    update: {},
    create: {
      email: "athlete@test.com",
      passwordHash: hashedPassword,
      firstName: "Luc",
      lastName: "Moreau",
      role: GlobalRole.ATHLETE,
      athleteProfile: {
        create: {
          firstName: "Luc",        // ✅ champ requis
          lastName: "Moreau",
          club: "Paris HG",
          country: "France",
        },
      },
    },
  });

  console.log("✅ Utilisateur athlète créé:", athleteUser.email);

  console.log("\n📝 Comptes de test créés:");
  console.log("   - organisateur@test.com / admin123");
  console.log("   - directeur@test.com / admin123");
  console.log("   - admin@test.com / admin123");
  console.log("   - athlete@test.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

