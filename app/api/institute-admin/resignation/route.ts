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
        const { user } = body;

        if (user === 'student') {
            const students = await db.students.findMany({
                where: {
                    institute_id: session.user.id,
                },include:{
                    classes:{
                        select:{
                            grade_level:true,
                            class_name:true,
                        }
                    }
                }
            });

            return NextResponse.json(students, { status: 200 });
        }
        if (user === 'teacher') {
            const teachers = await db.teachers.findMany({
                where: {
                    institute_id: session.user.id,
                },
            });

            return NextResponse.json(teachers, { status: 200 });
        }
        if (user === 'principal') {
            const principals = await db.principals.findMany({
                where: {
                    institute_id: session.user.id,
                },
            });

            return NextResponse.json(principals, { status: 200 });
        }
        return new NextResponse('Unautherized', { status: 403 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
