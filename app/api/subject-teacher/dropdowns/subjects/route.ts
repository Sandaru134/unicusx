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

        const subjects = await db.teacher_subjects.findMany({
            where: {
                teacher_id: session.user.id,
            },
            select: {
                subject:{
                    select:{
                        subject_id:true,
                        name:true,
                    }
                }
            },
        });

        if (!subjects) {
            return new NextResponse('subject not found', { status: 403 });
        }

        // Remove duplicates
        const uniqueSubjects = subjects.reduce<{ subject: { name: string; }; }[]>((unique, item) => {
            const isDuplicate = unique.some(uniqueItem => uniqueItem.subject.name === item.subject.name);
            return isDuplicate ? unique : [...unique, item];
        }, []);

        return NextResponse.json(uniqueSubjects, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}