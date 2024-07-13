/*
  Warnings:

  - You are about to drop the column `classRoomId` on the `Query` table. All the data in the column will be lost.
  - You are about to drop the `ClassRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassRoom" DROP CONSTRAINT "ClassRoom_userId_fkey";

-- DropForeignKey
ALTER TABLE "Query" DROP CONSTRAINT "Query_classRoomId_fkey";

-- AlterTable
ALTER TABLE "Query" DROP COLUMN "classRoomId",
ADD COLUMN     "classroomId" INTEGER,
ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "ClassRoom";

-- CreateTable
CREATE TABLE "Classroom" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoId" TEXT NOT NULL,
    "title" TEXT,
    "image_url" TEXT,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserClassroom" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classroomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserClassroom_pkey" PRIMARY KEY ("userId","classroomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_videoId_key" ON "Classroom"("videoId");

-- AddForeignKey
ALTER TABLE "UserClassroom" ADD CONSTRAINT "UserClassroom_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClassroom" ADD CONSTRAINT "UserClassroom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
