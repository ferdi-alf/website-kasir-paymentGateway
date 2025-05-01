import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt-ts";

const prisma = new PrismaClient();
async function main() {
  const password = "admin123";
  const hashedPassword = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      image: "/avatar/avatar-1.png",
      username: "admin",
      role: "ADMIN",
      password: hashedPassword,
    },
  });
  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
