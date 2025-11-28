import { GlobalRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: GlobalRole;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: GlobalRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: GlobalRole;
  }
}

