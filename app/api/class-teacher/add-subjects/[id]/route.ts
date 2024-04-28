import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const existStatus = await db.student_subjects_Status.findUnique({
            where: {
                id: params.id,
            },
        });
        let status;

        if (!existStatus) {
            return new NextResponse('Not found', { status: 404 });
        }

        if (existStatus.added === true) {
            status = await db.student_subjects_Status.update({
                where: {
                    id: params.id,
                },
                data: {
                    added: false,
                },
            });

            await db.marks.deleteMany({
                where: {
                    student_subject_id: params.id,
                },
            });
        } else {
            status = await db.student_subjects_Status.update({
                where: {
                    id: params.id,
                },
                data: {
                    added: true,
                },
            });

            const terms = await db.terms.findMany({
                where: {
                    institute_id: status.institute_id,
                    completed: false,
                },
            });

            for (const term of terms) {
                await db.marks.create({
                    data: {
                        student_subject_id: status.id,
                        student_id: status.student_id,
                        subject_id: status.subject_id,
                        term_id: term.term_id,
                        class_id: status.class_id,
                        institute_id: status.institute_id,
                    },
                });
            }
        }

        return NextResponse.json(status, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
