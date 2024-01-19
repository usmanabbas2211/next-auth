import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

async function connectPrisma(): Promise<PrismaClient> {
    if (!prisma) {
        prisma = new PrismaClient();

        try {
            await prisma.$connect();
            console.log('Prisma client connected to the database');
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
        process.on('beforeExit', async () => {
            if (prisma) {
                await prisma.$disconnect();
            }
        });
    }

    if (!prisma) {
        throw new Error('Prisma client not initialized');
    }

    return prisma;
}

export { connectPrisma };