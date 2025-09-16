-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "documentType" TEXT;

-- AlterTable
ALTER TABLE "public"."UserSecurity" ADD COLUMN     "pin" TEXT;
