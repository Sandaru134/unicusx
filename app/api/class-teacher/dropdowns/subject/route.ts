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

        const teacher = await db.teachers.findFirst({
            where: {
                teacher_id: session.user.id,
            },include:{
                class:true
            }
        });

        if (!teacher?.class) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        let category;
        switch (true) {
            case teacher.class?.grade_level <= 5:
                category = 'Primary';
                break;
            case teacher.class?.grade_level <= 11:
                category = 'Secondary';
                break;
            case teacher.class?.grade_level <= 13:
                category = 'Collegiate';
                break;
        }

        const subjects = await db.institute_subject_status.findMany({
            where:{
                institute_id:teacher.institute_id,
                status:true,
                subject:{
                    category:category
                }
            },select:{
                subject:{
                    select:{
                        subject_id:true,
                        name:true
                    }
                }
            }
        })

        if(!subjects){
            return new NextResponse('subject not found', { status: 403 });
        }

        return NextResponse.json(subjects, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
