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

        const grades = await db.teacher_subjects.findMany({
            where: {
                teacher_id: session.user.id,
            },
            select: {
                class: {
                    select: { grade_level: true },
                },
            },
        });

        if (!grades) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const uniqueGrades = grades.reduce<{ class: { grade_level: number; }; }[]>((unique, item) => {
            const isDuplicate = unique.some(uniqueItem => uniqueItem.class.grade_level === item.class.grade_level);
            return isDuplicate ? unique : [...unique, item];
        }, []);

        return NextResponse.json(uniqueGrades, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
