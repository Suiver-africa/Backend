/*
  Warnings:

  - You are about to drop the column `documentType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pin` on the `UserSecurity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,currency]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Wallet_userId_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "documentType",
ADD COLUMN     "socType" TEXT;

-- AlterTable
ALTER TABLE "public"."UserSecurity" DROP COLUMN "pin",
ALTER COLUMN "pinHash" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Wallet" ALTER COLUMN "currency" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."CryptoAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CryptoAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CryptoDeposit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "ngnAmount" BIGINT NOT NULL,
    "fee" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CryptoDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAddress_address_key" ON "public"."CryptoAddress"("address");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoDeposit_txHash_key" ON "public"."CryptoDeposit"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_currency_key" ON "public"."Wallet"("userId", "currency");

-- AddForeignKey
ALTER TABLE "public"."CryptoAddress" ADD CONSTRAINT "CryptoAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CryptoDeposit" ADD CONSTRAINT "CryptoDeposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
