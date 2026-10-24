-- CreateEnum
CREATE TYPE "Status" AS ENUM ('approved', 'declined');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "status" "Status" NOT NULL,
    "refusalReason" TEXT,
    "cardLast4" TEXT NOT NULL,
    "cardHolder" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
