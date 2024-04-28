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

        //get institute principal details
        const principal = await db.principals.findFirst({
            where: {
                institute_id: session.user.institute_id,
                type: 'Principal',
            },
        });

        const update = await db.term_class.update({
            where: {
                id: params.id,
            },
            data: {
                principal_signed: true,
                principal_id: principal?.principal_id,
            },
        });

        //get detail report to update
        const reports = await db.report.findMany({
            where: {
                institute_id: principal?.institute_id,
                term_id: update.term_id,
                class_id: update.class_id,
            },
            include: {
                student: true,
                institute: true,
                terms: true,
            },
        });

        //get term year
        const year = reports[0].terms.start.slice(0, 4);

        if (!reports) {
            return new NextResponse('report not found', { status: 403 });
        }

        let term_id;

        for (const report of reports) {
            await db.report.update({
                where: {
                    id: report.id,
                },
                data: {
                    principal_signed: true,
                },
            });

            term_id = report.term_id;
        }

        //-------------------------------------------------------------------------------
        let principalSigned = true;

        const allReport = await db.report.findMany({
            where: {
                institute_id: session.user.id,
                term_id: term_id,
            },
        });

        for (const report of allReport) {
            if (report.principal_signed === false) {
                principalSigned = false;
                break;
            }
        }

        if (principalSigned) {
            const termName = await db.terms.findUnique({
                where: {
                    term_id: term_id,
                },
            });

            if (!termName) {
                return new NextResponse('term not found', { status: 403 });
            }

            if (termName.term_name === 'Third') {
                const students = await db.students.findMany({
                    where: {
                        institute_id: session.user.id,
                        left: false,
                    },
                });

                //clear student_subject_status table
                await db.student_subjects_Status.deleteMany({
                    where: {
                        institute_id: session.user.id,
                    },
                });

                //update student grade level end of the third term
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
                        if (!newclass) {
                            const newClass = await db.classes.create({
                                data: {
                                    class_name: studentClass.class_name,
                                    grade_level: newStudentGrade,
                                    institute_id: session.user.id,
                                },
                            });

                            //create term_class for each term
                            const terms = await db.terms.findMany({
                                where: {
                                    institute_id: session.user.id,
                                    completed: false,
                                },
                            });

                            for (const term of terms) {
                                await db.term_class.create({
                                    data: {
                                        term_id: term.term_id,
                                        class_id: newClass.class_id,
                                        institute_id: session.user.id,
                                    },
                                });
                            }

                            await db.students.update({
                                where: {
                                    student_id: student.student_id,
                                },
                                data: {
                                    class_id: newClass?.class_id,
                                },
                            });
                        } else {
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

                //create record for updated student
                const newStudents = await db.students.findMany({
                    where: {
                        institute_id: session.user.id,
                        left: false,
                    },
                });

                //get subjects for to create new record in student_subject_status
                const subjects = await db.institute_subject_status.findMany({
                    where: {
                        institute_id: session.user.id,
                        status: true,
                    },
                    include: {
                        subject: true,
                    },
                });

                for (const student of newStudents) {
                    //create new student_subject_status
                    for (const subject of subjects) {
                        await db.student_subjects_Status.create({
                            data: {
                                student_id: student.student_id,
                                subject_id: subject.subject.subject_id,
                                institute_id: session.user.id,
                                class_id: student.class_id,
                            },
                        });
                    }
                }
            }
        }

        return NextResponse.json(update, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
