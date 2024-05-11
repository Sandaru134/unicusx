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

        if (!params.id) {
            return new NextResponse('Invalid id', { status: 400 });
        }

        const mark = await db.marks.findUnique({
            where: {
                id: params.id,
            },
        });

        if (!mark) {
            return new NextResponse('Mark not found', { status: 403 });
        }

        let allMarksPresent = true;
        let studentAllMarksPresent = true;

        const updatedMarks = await db.marks.update({
            where: {
                id: params.id,
            },
            data: {
                absent: true,
            },
        });

        const marks = await db.marks.findMany({
            where: {
                student_id: updatedMarks.student_id,
                class_id: updatedMarks.class_id,
                term_id: updatedMarks.term_id,
                absent: false,
            },
        });

        //check if all marks are present for student
        if (marks) {
            for (const mark of marks) {
                if (mark.mark === null) {
                    studentAllMarksPresent = false;
                    break;
                }
            }
        }

        //update report status if all marks are present for student
        if (studentAllMarksPresent) {
            const report = await db.report.findFirst({
                where: {
                    student_id: updatedMarks.student_id,
                    class_id: updatedMarks.class_id,
                    term_id: updatedMarks.term_id,
                },
            });
            if (report) {
                await db.report.update({
                    where: {
                        id: report.id,
                    },
                    data: {
                        completed: true,
                    },
                });
            }
        }

        const termStatuses = await db.marks.findMany({
            where: {
                term_id: updatedMarks.term_id,
                absent: false,
            },
        });

        //check if all marks are present for term
        for (const termStatus of termStatuses) {
            if (termStatus.mark === null) {
                allMarksPresent = false;
                break;
            }
        }

        //update term status
        if (allMarksPresent) {
            await db.terms.update({
                where: {
                    term_id: updatedMarks.term_id,
                },
                data: {
                    completed: true,
                },
            });
        }

        return NextResponse.json(updatedMarks, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
