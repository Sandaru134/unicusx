import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const grade = await db.teachers.findFirst({
            where: {
                teacher_id: session.user.id,
            },
            select: {
                class: {
                    select: { grade_level: true },
                },
            },
        });

        if (!grade) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        return NextResponse.json(grade, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
