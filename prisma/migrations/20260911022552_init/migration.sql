-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlay" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "player_status" TEXT NOT NULL,

    CONSTRAINT "GamePlay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "task_name" TEXT NOT NULL,
    "duration_p" INTEGER NOT NULL,
    "irrational_p" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskProgress" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "gameplay_id" INTEGER NOT NULL,
    "task_status" INTEGER NOT NULL,

    CONSTRAINT "TaskProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OvertimeLog" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "gameplay_id" INTEGER NOT NULL,
    "overtime_hours" INTEGER NOT NULL,

    CONSTRAINT "OvertimeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "TaskProgress_task_id_gameplay_id_key" ON "TaskProgress"("task_id", "gameplay_id");

-- AddForeignKey
ALTER TABLE "GamePlay" ADD CONSTRAINT "GamePlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProgress" ADD CONSTRAINT "TaskProgress_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProgress" ADD CONSTRAINT "TaskProgress_gameplay_id_fkey" FOREIGN KEY ("gameplay_id") REFERENCES "GamePlay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OvertimeLog" ADD CONSTRAINT "OvertimeLog_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OvertimeLog" ADD CONSTRAINT "OvertimeLog_gameplay_id_fkey" FOREIGN KEY ("gameplay_id") REFERENCES "GamePlay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
