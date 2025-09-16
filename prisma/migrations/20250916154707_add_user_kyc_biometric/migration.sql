-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "biometricEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kycStatus" TEXT DEFAULT 'NOT_SUBMITTED';
