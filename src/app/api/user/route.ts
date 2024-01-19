import { NextResponse } from "next/server"
import { connectPrisma } from '../../../utils/PrismaHelper';

// const prisma = new PrismaClient()
//add this object to PrismaClient for logs { log: ['query', 'info'] }

export const GET = async () => {
    try {
        const prisma = await connectPrisma();
        const users = await prisma.user.findMany({})
        return NextResponse.json({ users }, { status: 200 })
    }
    catch {
        return NextResponse.json({ message: "Server Error!" }, { status: 500 })
    }
}