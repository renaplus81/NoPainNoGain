/*
  Warnings:

  - You are about to drop the column `duration_p` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `irrational_p` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `OvertimeLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `irrational` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OvertimeLog" DROP CONSTRAINT "OvertimeLog_gameplay_id_fkey";

-- DropForeignKey
ALTER TABLE "OvertimeLog" DROP CONSTRAINT "OvertimeLog_task_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskProgress" DROP CONSTRAINT "TaskProgress_gameplay_id_fkey";

-- DropForeignKey
ALTER TABLE "TaskProgress" DROP CONSTRAINT "TaskProgress_task_id_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "duration_p",
DROP COLUMN "irrational_p",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "irrational" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OvertimeLog";

-- DropTable
DROP TABLE "TaskProgress";

-- CreateTable
CREATE TABLE "GamePlayDetail" (
    "task_id" INTEGER NOT NULL,
    "gameplay_id" INTEGER NOT NULL,
    "overtime_hours" INTEGER NOT NULL,
    "when_overtime_happen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GamePlayDetail_pkey" PRIMARY KEY ("gameplay_id","task_id")
);

-- AddForeignKey
ALTER TABLE "GamePlayDetail" ADD CONSTRAINT "GamePlayDetail_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayDetail" ADD CONSTRAINT "GamePlayDetail_gameplay_id_fkey" FOREIGN KEY ("gameplay_id") REFERENCES "GamePlay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
