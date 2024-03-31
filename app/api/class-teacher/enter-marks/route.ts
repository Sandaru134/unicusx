import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await request.json();
        const { term_id, grade_level, class_name, subject } = body;
        console.log(body);

        const institute_id = await db.teachers.findUnique({
            where: {
                index: session.user.id,
            },
            select: {
                institute_id: true,
            },
        });

        const classId = await db.classes.findFirst({
            where: {
                grade_level: grade_level,
                class_name: class_name,
            },
            select: {
                class_id: true,
            },
        });

        const marks = await db.marks.findMany({
            where: {
                institute_id: institute_id?.institute_id,
                term_id: term_id,
                student_subject: {
                    class_id: classId?.class_id,
                    subject_id: subject,
                },
            },
            include: {
                student_subject: {
                    include: {
                        student: {
                            select: {
                                full_name: true,
                                index: true,
                            },
                        },
                    },
                },
            },
        });
        console.log(marks);
        return NextResponse.json(marks, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
