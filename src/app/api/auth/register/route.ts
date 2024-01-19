import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { connectPrisma } from '../../../../utils/PrismaHelper';

export async function POST(request: Request) {
    try {
        const { email, password, username } = await request.json();
        // validate email and password
        console.log({ email, password, username });

        const hashedPassword = await hash(password, 10);
        const prisma = await connectPrisma();
        await prisma.user.create({
            data: { email, name: username, password: hashedPassword }
        })
    } catch (e) {
        console.log({ e });
    }

    return NextResponse.json({ message: 'success' });
}