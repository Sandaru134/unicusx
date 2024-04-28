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

        const institute_id = await db.teachers.findUnique({
            where: {
                teacher_id: session.user.id,
            },
            select: {
                institute_id: true,
            },
        });

        if (!institute_id) {
            return new NextResponse('not found', { status: 404 });
        }

        const classId = await db.classes.findFirst({
            where: {
                institute_id: institute_id.institute_id,
                grade_level: grade_level,
                class_name: class_name,
            },
            select: {
                class_id: true,
            },
        });
        if (!classId) {
            return NextResponse.json('record not found', { status: 403 });
        }

        

        const marks = await db.marks.findMany({
            where: {
                institute_id: institute_id?.institute_id,
                term_id: term_id,
                class_id: classId?.class_id,
                subject_id: subject,
            },
            include: {
                student: true,
            },
        });

        return NextResponse.json(marks, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
