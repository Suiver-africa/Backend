import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Cleanup for idempotent seeding (dev only)
  await prisma.otp.deleteMany().catch(() => { })
  await prisma.transaction.deleteMany().catch(() => { })
  await prisma.wallet.deleteMany().catch(() => { })
  await prisma.beneficiary.deleteMany().catch(() => { })
  await prisma.paymentLink.deleteMany().catch(() => { })
  await prisma.user.deleteMany().catch(() => { })

  const alice = await prisma.user.create({
    data: {
      firstName: "test",
      lastName: "Agabaenwere",
      email: "alice@suiver.app",
      password: "$2b$10$eW5nbG9iYWwxMjM0NTY3ODkwcGFzc3dvcmQ=", // dummy hashed value; replace in prod
      phone: "08010000001",
      tag: "alice",
      referralCode: "REF-ALICE"
    }
  })

  const aliceWallet = await prisma.wallet.create({
    data: { userId: alice.id, balance: 100000, currency: "NGN" }
  })

  const bob = await prisma.user.create({
    data: {
      firstName: "Bob",
      lastName: "Suiver",
      email: "bob@suiver.app",
      password: "$2b$10$eW5nbG9iYWwyMzQ1Njc4OTBwYXNzd29yZA==",
      phone: "08020000002",
      tag: "bob",
      referralCode: "REF-BOB",
      referredById: alice.id
    }
  })

  const bobWallet = await prisma.wallet.create({
    data: { userId: bob.id, balance: 50000, currency: "NGN" }
  })

  await prisma.transaction.createMany({
    data: [
      {
        fromWalletId: aliceWallet.id,
        toWalletId: bobWallet.id,
        userId: alice.id,
        type: "TRANSFER",
        amount: BigInt(10000),
        nairaAmount: 10000,
        currency: "NGN",
        description: "Seed send",
        status: "PENDING"
      },
      {
        fromWalletId: bobWallet.id,
        toWalletId: aliceWallet.id,
        userId: bob.id,
        type: "RECEIVE",
        amount: BigInt(5000),
        nairaAmount: 5000,
        currency: "NGN",
        description: "Seed receive",
        status: "PENDING"
      }
    ]
  })

  // 🔐 Add OTP seeds for testing
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000) // 10 min expiry

  await prisma.otp.createMany({
    data: [
      {
        email: "alice@suiver.app",
        type: "SIGNUP",
        code: "123456",
        expiresAt,
        attempts: 0,
        verified: false,
        createdAt: now,

      },
      {
        email: "bob@suiver.app",
        type: "LOGIN",
        code: "654321",
        expiresAt,
        attempts: 1,
        verified: false,
        createdAt: now,

      }
    ]
  })

  console.log("✅ Seed complete: users, wallets, transactions, otps")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
