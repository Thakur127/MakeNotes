-- AlterTable
ALTER TABLE "Query" ADD COLUMN     "userClassroomClassroomId" INTEGER,
ADD COLUMN     "userClassroomUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_userClassroomUserId_userClassroomClassroomId_fkey" FOREIGN KEY ("userClassroomUserId", "userClassroomClassroomId") REFERENCES "UserClassroom"("userId", "classroomId") ON DELETE SET NULL ON UPDATE CASCADE;
