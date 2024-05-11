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

        const className = await db.teacher_subjects.findMany({
            where: {
                teacher_id: session.user.id,
            },
            select: {
                class: {
                    select: { class_name: true },
                },
            },
        });

        if (!className) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const uniqueclassNames = className.reduce<{ class: { class_name: string; }; }[]>((unique, item) => {
            const isDuplicate = unique.some(uniqueItem => uniqueItem.class.class_name === item.class.class_name);
            return isDuplicate ? unique : [...unique, item];
        }, []);

        return NextResponse.json(uniqueclassNames, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
