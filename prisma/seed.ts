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

  // --------------------------------------------------------
  // 1. Création des Fédérations
  // --------------------------------------------------------
  console.log("🏛️ Création des fédérations...");

  const fedEurope = await prisma.federation.upsert({
    where: { slug: "EU" },
    update: {},
    create: {
      name: "Highland Games Europe",
      slug: "EU",
      themeColor: "#10b981", // Emerald default
    },
  });

  const fedFrance = await prisma.federation.upsert({
    where: { slug: "FR" },
    update: {},
    create: {
      name: "Fédération Française (AJEF)",
      slug: "FR",
      themeColor: "#3b82f6", // Blue
    },
  });

  const fedHolland = await prisma.federation.upsert({
    where: { slug: "NL" },
    update: {},
    create: {
      name: "Federatie Holland",
      slug: "NL",
      themeColor: "#f97316", // Orange
    },
  });

  console.log("✅ Fédérations créées: EU, FR, NL");

  // --------------------------------------------------------
  // 2. Création des Users
  // --------------------------------------------------------

  // Créer un utilisateur organisateur de test (Lié à la France)
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const organisateur = await prisma.user.upsert({
    where: { email: "organisateur@test.com" },
    update: { federationId: fedFrance.id },
    create: {
      email: "organisateur@test.com",
      passwordHash: hashedPassword,
      firstName: "Jean",
      lastName: "Dupont",
      role: GlobalRole.ORGANISATEUR,
      isApproved: true,
      federationId: fedFrance.id,
    },
  });

  console.log("✅ Utilisateur organisateur créé (FR):", organisateur.email);

  // Créer un utilisateur directeur athlétique de test (Lié à la Hollande)
  const directeur = await prisma.user.upsert({
    where: { email: "directeur@test.com" },
    update: { federationId: fedHolland.id },
    create: {
      email: "directeur@test.com",
      passwordHash: hashedPassword,
      firstName: "Marie",
      lastName: "Martin",
      role: GlobalRole.DIRECTEUR_ATHLETIQUE,
      isApproved: true,
      federationId: fedHolland.id,
    },
  });

  console.log("✅ Utilisateur directeur athlétique créé (NL):", directeur.email);

  // Créer un utilisateur admin plateforme de test (Lié à l'Europe)
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: { federationId: fedEurope.id },
    create: {
      email: "admin@test.com",
      passwordHash: hashedPassword,
      firstName: "Admin",
      lastName: "Système",
      role: GlobalRole.PLATFORM_ADMIN,
      isApproved: true,
      federationId: fedEurope.id,
    },
  });

  console.log("✅ Utilisateur admin plateforme créé (EU):", admin.email);

  // Créer un utilisateur athlète de test (Lié à la France)
  const athleteUser = await prisma.user.upsert({
    where: { email: "athlete@test.com" },
    update: {}, // On n'update pas la fédération user ici, c'est l'athlete profile qui compte
    create: {
      email: "athlete@test.com",
      passwordHash: hashedPassword,
      firstName: "Luc",
      lastName: "Moreau",
      role: GlobalRole.ATHLETE,
      federationId: fedFrance.id,
      athleteProfile: {
        create: {
          firstName: "Luc",
          lastName: "Moreau",
          club: "Paris HG",
          country: "France",
          federationId: fedFrance.id,
        },
      },
    },
  });

  // Update athlete profile specifically if user existed
  if (athleteUser) {
    const existingAthlete = await prisma.athlete.findUnique({ where: { userId: athleteUser.id } });
    if (existingAthlete) {
      await prisma.athlete.update({
        where: { id: existingAthlete.id },
        data: { federationId: fedFrance.id }
      });
    }
  }

  console.log("✅ Utilisateur athlète créé (FR):", athleteUser.email);

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

