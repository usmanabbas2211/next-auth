import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    console.log("DB connected!")
    //add this object to PrismaClient for logs { log: ['query', 'info'] }
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;