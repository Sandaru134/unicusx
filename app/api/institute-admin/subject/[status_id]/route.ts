import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { status_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        if (!params.status_id) {
            return new NextResponse('Status id is required', { status: 400 });
        }

        const status = await db.institute_subject_status.findFirst({
            where: {
                id: params.status_id,
            },
        });

        //check subject already active or not
        if (status?.status === false) {
            const updatedStatus = await db.institute_subject_status.update({
                where: {
                    id: params.status_id,
                },
                data: {
                    status: true,
                },
            });

            const students = await db.students.findMany({
                where: {
                    institute_id: updatedStatus.institute_id,
                    left:false
                },
            });

            for (const student of students) {
                await db.student_subjects_Status.create({
                    data: {
                        student_id: student.student_id,
                        subject_id: updatedStatus.subject_id,
                        institute_id: updatedStatus.institute_id,
                        class_id: student.class_id,
                    },
                });
            }

            return NextResponse.json(updatedStatus, { status: 200 });
        }

        const updatedStatus = await db.institute_subject_status.update({
            where: {
                id: params.status_id,
            },
            data: {
                status: false,
            },
        });

        await db.student_subjects_Status.deleteMany({
            where: {
                subject_id: updatedStatus.subject_id,
            },
        });

        return NextResponse.json(updatedStatus, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
