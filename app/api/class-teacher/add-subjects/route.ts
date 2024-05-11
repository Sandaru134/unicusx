import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await req.json();

        const { grade_level, class_name, subject_id } = body;

        const institute_id = await db.teachers.findUnique({
            where: {
                teacher_id: session.user.id,
            },
            select: {
                institute_id: true,
            },
        });

        if (!institute_id) {
            return new Response('Institute not found', { status: 403 });
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
            return new Response('Class not found', { status: 403 });
        }

        const students = await db.student_subjects_Status.findMany({
            where: {
                institute_id: institute_id.institute_id,
                subject_id: subject_id,
                student: {
                    class_id: classId?.class_id,
                },
                // added:false
            },
            include: {
                student: true,
            },
        });

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const institute_id = await db.teachers.findUnique({
            where: {
                teacher_id: session.user.id,
            },
        });

        const subjects = await db.institute_subject_status.findMany({
            where: {
                institute_id: institute_id?.institute_id,
                status: true,
            },
            include: {
                subject: true,
            },
        });

        return NextResponse.json(subjects, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
