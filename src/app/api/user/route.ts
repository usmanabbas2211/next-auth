import { NextResponse } from "next/server"
import prisma from "@/utils/db";

export const GET = async () => {
    try {
        const users = await prisma.user.findMany({})
        return NextResponse.json({ length: users.length, users }, { status: 200 })
    }
    catch {
        return NextResponse.json({ message: "Server Error!" }, { status: 500 })
    }
}