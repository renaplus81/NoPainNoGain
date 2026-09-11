//シングルトン

import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {prisma?: PrismaClient}

//??: 保管場所にあればそれ、なければ新規作成。
export const prisma = 
globalForPrisma.prisma ??
new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

//直訳:
/* もし今動いている環境が「本番(produnction)」ではないなら、globalForPrisma.prismaという場所に今作ったprismaを保存しておく */
if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/* なぜ本番「production」ではない時だけ保存するのか
そもそもなぜglobalForPrismaという保管場所が必要だったのか。
本番環境（実際にユーザーが使うサーバー）では、この保存するたびに再読み込みされるという現象自体が起きない。 */