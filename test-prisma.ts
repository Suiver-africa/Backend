import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@suiver.app",
      password: "hashedpassword123",
      fullName: "Test User"
    }
  })

  console.log("User created:", user)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
