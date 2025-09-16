/*
  Warnings:

  - You are about to drop the column `biometricEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `kycStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "biometricEnabled",
DROP COLUMN "kycStatus",
DROP COLUMN "pin",
ALTER COLUMN "referralCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserSecurity" ADD COLUMN     "biometric" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Wallet" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."UserSecurity" ADD CONSTRAINT "UserSecurity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
