-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KASIR', 'PEMBELI');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "image" TEXT,
    "hashed_password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PEMBELI',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
