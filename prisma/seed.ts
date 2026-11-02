import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
    await prisma.task.create({
        data: { task_name: "家3件売ってこい", duration: 480, irrational: 100 },
    });
    await prisma.task.create({
        data: { task_name: "来週の出張だけど交通費は実費でお願いします(新幹線往復5万円)", duration: 0, irrational: 70 },
    });
    await prisma.task.create({
        data: { task_name: "有給取ったら「で、いつ有給取ったことにする?」と聞かれる", duration: 30, irrational: 90 },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });