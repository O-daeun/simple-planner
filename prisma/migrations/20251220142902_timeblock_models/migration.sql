/*
  Warnings:

  - You are about to drop the column `googleSub` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RecurrenceExceptionType" AS ENUM ('SKIP', 'MODIFY');

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_goalId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropIndex
DROP INDEX "User_googleSub_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleSub",
DROP COLUMN "isActive",
DROP COLUMN "lastLoginAt",
ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- DropTable
DROP TABLE "Goal";

-- DropTable
DROP TABLE "Task";

-- DropEnum
DROP TYPE "GoalLevel";

-- DropEnum
DROP TYPE "GoalStatus";

-- DropEnum
DROP TYPE "TaskStatus";

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "TimeBlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startMin" INTEGER NOT NULL,
    "endMin" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeBlockRecurrence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startMin" INTEGER NOT NULL,
    "endMin" INTEGER NOT NULL,
    "daysOfWeek" INTEGER[],
    "startDate" DATE NOT NULL,
    "untilDate" DATE,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeBlockRecurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeBlockRecurrenceException" (
    "id" TEXT NOT NULL,
    "recurrenceId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "type" "RecurrenceExceptionType" NOT NULL,
    "overrideStartMin" INTEGER,
    "overrideEndMin" INTEGER,
    "overrideTitle" TEXT,
    "overrideColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeBlockRecurrenceException_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "TimeBlock_userId_date_idx" ON "TimeBlock"("userId", "date");

-- CreateIndex
CREATE INDEX "TimeBlock_userId_date_startMin_idx" ON "TimeBlock"("userId", "date", "startMin");

-- CreateIndex
CREATE INDEX "TimeBlockRecurrence_userId_startDate_idx" ON "TimeBlockRecurrence"("userId", "startDate");

-- CreateIndex
CREATE INDEX "TimeBlockRecurrenceException_recurrenceId_idx" ON "TimeBlockRecurrenceException"("recurrenceId");

-- CreateIndex
CREATE UNIQUE INDEX "TimeBlockRecurrenceException_recurrenceId_date_key" ON "TimeBlockRecurrenceException"("recurrenceId", "date");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeBlock" ADD CONSTRAINT "TimeBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeBlockRecurrence" ADD CONSTRAINT "TimeBlockRecurrence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeBlockRecurrenceException" ADD CONSTRAINT "TimeBlockRecurrenceException_recurrenceId_fkey" FOREIGN KEY ("recurrenceId") REFERENCES "TimeBlockRecurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
