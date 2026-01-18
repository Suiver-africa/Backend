import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "suiverhq@gmail.com",
      password: "hashedpassword123",
      firstName: "test",
      lastName: "user",
    }
  })

  console.log("User created:", user)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
