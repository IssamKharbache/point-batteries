/*
  Warnings:

  - The `garantie` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ESPECE', 'CHECK', 'VIREMENT');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CAISSIER';

-- DropForeignKey
ALTER TABLE "AchatProduct" DROP CONSTRAINT "AchatProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- AlterTable
ALTER TABLE "Product" RENAME CONSTRAINT "Product_pkey" TO "Product_temp_pkey",
ADD COLUMN     "achatPrice" DOUBLE PRECISION,
ADD COLUMN     "isOnline" BOOLEAN DEFAULT true,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "capacite" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "garantie",
ADD COLUMN     "garantie" TEXT DEFAULT 'NOGARANTIE',
ALTER COLUMN "isAchatProduct" DROP NOT NULL,
ALTER COLUMN "refProduct" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(6);

-- CreateTable
CREATE TABLE "Vente" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "clientNom" TEXT NOT NULL,
    "clientPrenom" TEXT NOT NULL,
    "clientTel" TEXT,
    "nomDuCaissier" TEXT,
    "venteRef" TEXT NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "factureCode" TEXT,
    "generateFacture" BOOLEAN NOT NULL DEFAULT false,
    "venteBenifits" DOUBLE PRECISION,
    "ice" TEXT,

    CONSTRAINT "Vente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenteProduct" (
    "venteId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION,
    "designationProduit" TEXT,
    "productVenteBenifit" DOUBLE PRECISION,
    "marque" TEXT,
    "refProduct" TEXT,

    CONSTRAINT "VenteProduct_pkey" PRIMARY KEY ("venteId","productId")
);

-- CreateTable
CREATE TABLE "CompanyClient" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "identifiant" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CompanyClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cost" (
    "id" UUID NOT NULL,
    "natureDuFrais" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Cost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vente_venteRef_key" ON "Vente"("venteRef");

-- CreateIndex
CREATE UNIQUE INDEX "Vente_factureCode_key" ON "Vente"("factureCode");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyClient_identifiant_key" ON "CompanyClient"("identifiant");

-- CreateIndex
CREATE UNIQUE INDEX "Banner_slug_key" ON "Banner"("slug");

-- AddForeignKey
ALTER TABLE "Vente" ADD CONSTRAINT "Vente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenteProduct" ADD CONSTRAINT "VenteProduct_venteId_fkey" FOREIGN KEY ("venteId") REFERENCES "Vente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Product_designationProduit_key" RENAME TO "Product_temp_designationProduit_key";

-- RenameIndex
ALTER INDEX "Product_imageKey_key" RENAME TO "Product_temp_imageKey_key";

-- RenameIndex
ALTER INDEX "Product_refProduct_key" RENAME TO "Product_temp_refProduct_key";

-- RenameIndex
ALTER INDEX "Product_slug_key" RENAME TO "Product_temp_slug_key";
