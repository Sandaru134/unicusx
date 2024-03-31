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
        const { term_name, grade_level, class_name, year } = body;

        const institute = await db.teachers.findUnique({
            where: {
                teacher_id: session.user.id,
            },
        });

        const term = await db.terms.findFirst({
            where:{
                institute_id: institute?.institute_id,
                start:{
                    startsWith:year
                },
                term_name:term_name
            }
        })

        const studentClass = await db.classes.findFirst({
            where: {
                institute_id: institute?.institute_id,
                grade_level: grade_level,
                class_name: class_name,
            },
        });

        const students = await db.report.findMany({
            where: {
                institute_id: institute?.institute_id,
                term_id: term?.term_id,
                class_id: studentClass?.class_id,
            },include:{
                student:true
            }
        });

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
