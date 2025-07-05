const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@taskfast.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@taskfast.com",
      password: "123456", // Sem hash
    },
  });

  console.log("Usuário criado:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
