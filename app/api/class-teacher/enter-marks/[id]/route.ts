import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        let allMarksPresent = true;

        const body = await request.json();

        const { mark } = body;

        const updatedMarks = await db.marks.update({
            where: {
                id: params.id,
            },
            data: {
                mark: mark,
            },
        });

        const termStatuses = await db.marks.findMany({
            where: {
                term_id: updatedMarks.term_id,
            },
        });
        const termName = await db.terms.findUnique({
            where: {
                term_id: updatedMarks.term_id,
            },
        });

        for (const termStatus of termStatuses) {
            if (termStatus.mark === null) {
                allMarksPresent = false;
                break;
            }
        }

        if (termName?.term_name === 'third') {
            if (allMarksPresent) {
                const teacher = await db.teachers.findUnique({
                    where: {
                        teacher_id: session.user.id,
                    },
                });

                const students = await db.students.findMany({
                    where: {
                        institute_id: teacher?.institute_id,
                    },
                });

                for (const student of students) {
                    const studentClass = await db.classes.findFirst({
                        where: {
                            class_id: student.class_id,
                        },
                    });
                    const studentGrade = studentClass?.grade_level;
                    if (!studentGrade) {
                        return new NextResponse('Internal error', { status: 500 });
                    }
                    if (studentGrade < 13) {
                        const newStudentGrade = studentGrade + 1;
                        const newclass = await db.classes.findFirst({
                            where: {
                                grade_level: newStudentGrade,
                                class_name: studentClass.class_name,
                            },
                        });

                        await db.students.update({
                            where: {
                                student_id: student.student_id,
                            },
                            data: {
                                class_id: newclass?.class_id,
                            },
                        });
                    }
                }
            }
        }

        if (allMarksPresent) {
            await db.terms.update({
                where: {
                    term_id: updatedMarks.term_id,
                },
                data: {
                    completed: true,
                },
            });

            await db.student_subjects_Status.updateMany({
                where: {
                    terms_id: updatedMarks.term_id,
                },
                data: {
                    completed: true,
                },
            });

            return NextResponse.json(updatedMarks, { status: 200 });
        }

        return NextResponse.json(updatedMarks, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
