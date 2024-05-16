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

        const updatedReport = await db.report.update({
            where: {
                id: params.id,
            },
            data: {
                class_teacher_signed: true,
                teacher_id: session.user.id,
            },
        });

        //update class teacher sign in institute
        const students = await db.report.findMany({
            where: {
                class_id: updatedReport.class_id,
                term_id: updatedReport.term_id,
            },
        });

        let allClassTeacherSigned = true;

        for (const student of students) {
            if (student.class_teacher_signed === false) {
                allClassTeacherSigned = false;
                break;
            }
        }

        if (allClassTeacherSigned) {
            const termClass = await db.term_class.findFirst({
                where: {
                    class_id: updatedReport.class_id,
                    term_id: updatedReport.term_id,
                },
            });
            if (termClass) {
                await db.term_class.update({
                    where: {
                        id: termClass.id,
                    },
                    data: {
                        teacher_signed: true,
                        teacher_id: session.user.id,
                    },
                });
            }
        }

        //calculation total marks and total students
        const studentMarks = await db.marks.findMany({
            where: {
                student_id: updatedReport.student_id,
                class_id: updatedReport.class_id,
                term_id: updatedReport.term_id,
            },
        });

        let totalStudentMarks = 0.00;

        for (const mark of studentMarks) {
            if (mark.mark) {
                totalStudentMarks = totalStudentMarks + mark.mark;
            }
        }

        const studentsCount = await db.report.aggregate({
            where: {
                term_id: updatedReport.term_id,
                class_id: updatedReport.class_id,
            },
            _count: true,
        });

        const totalSubjects = await db.student_subjects_Status.aggregate({
            where: {
                student_id: updatedReport.student_id,
                class_id: updatedReport.class_id,
                added: true,
            },
            _count: true,
        });

        const lastUpdatedReport = await db.report.update({
            where: {
                id: params.id,
            },
            data: {
                total_marks: totalStudentMarks,
                total_students: studentsCount._count,
                total_subjects: totalSubjects._count,
            },
            include: {
                terms: true,
            },
        });

        return NextResponse.json(lastUpdatedReport, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
