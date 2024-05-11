import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { report_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const finalReport = await db.final_Report.findFirst({
            where: {
                report_id: params.report_id,
            },
        });

        if (!finalReport) {
            //--------------------------------------------------------------
            let term_id;

            const report = await db.report.findUnique({
                where: {
                    id: params.report_id,
                },
                include: {
                    terms: true,
                },
            });

            if (!report) {
                return new NextResponse('Report not found', { status: 403 });
            }

            //get term year
            const year = report.terms.start.slice(0, 4);

            term_id = report.term_id;

            //create students final report
            let previousMark;

            if (report.total_students === null || report.total_marks === null) {
                return new NextResponse('Report not found', { status: 403 });
            }

            //get marks
            const marks = await db.marks.findMany({
                where: {
                    student_id: report.student_id,
                    term_id: term_id,
                    absent: false,
                },orderBy:{
                    updatedAt:'asc'
                }
            });


            let change;
            let pass = '';
            let average: Number;
            let formattedAverage: string;
            let nextTerm;

            //find highest total mark
            const highest_total_mark = await db.report.aggregate({
                where: {
                    term_id: term_id,
                    class_id: report.class_id,
                },
                _max: {
                    total_marks: true,
                },
            });

            if (highest_total_mark._max.total_marks === null) {
                return new NextResponse('Highest total mark not found', { status: 403 });
            }

            if (report.total_subjects === null) {
                return new NextResponse('Total subjects not found', { status: 403 });
            }

            average = report.total_marks / report.total_subjects;

            formattedAverage = average.toFixed(2);

            let numericFormattedAverage: number = parseFloat(formattedAverage);

            const studentRank = await db.report.findMany({
                where: {
                    institute_id: report.institute_id,
                    term_id: term_id,
                    class_id: report.class_id,
                },
            });

            if (!studentRank) {
                return new NextResponse('Student rank not found', { status: 403 });
            }

            const column = 'total_marks';

            studentRank.sort((a, b) => {
                // Access values for the specified column with type assertion
                const valueA = a[column] as number;
                const valueB = b[column] as number;

                // Sort descending (highest to lowest)
                return valueB - valueA;
            });

            function findRank(id: string): number {
                return studentRank.findIndex((studentRank) => studentRank.id === id);
            }

            //get institute principal
            const principalDetails = await db.principals.findFirst({
                where: {
                    institute_id: report.institute_id,
                    type: 'principal',
                },
            });

            if (!principalDetails) {
                return new NextResponse('principal not found', { status: 403 });
            }

            //get teacher details
            // const teacherDetails = await db.teachers.findUnique({
            //     where: {
            //         teacher_id: session.user.id,
            //     },
            // });
            // if (!teacherDetails) {
            //     return new NextResponse('teacher details not found', { status: 403 });
            // }

            //create final report
            for (const mark of marks) {

                if (mark.mark === null) {
                    return new NextResponse('Mark not found', { status: 403 });
                }

                const totalMarks = await db.report.findFirst({
                    where: {
                        student_id: mark.student_id,
                        term_id: mark.term_id,
                        class_id: mark.class_id,
                    },
                });

                if (totalMarks?.total_marks === null) {
                    return new NextResponse('total mark not found', { status: 403 });
                }

                change = 0;

                //get previous marks
                if (report.terms.term_name === 'Second') {
                    const previousTerm = await db.terms.findFirst({
                        where: {
                            start: {
                                startsWith: year,
                            },
                            term_name: 'First',
                        },
                    });

                    previousMark = await db.marks.findFirst({
                        where: {
                            institute_id: report.institute_id,
                            student_id: report.student_id,
                            term_id: previousTerm?.term_id,
                            subject_id: mark.subject_id,
                        },
                    });
                }

                //get previous marks
                if (report.terms.term_name === 'Third') {
                    const previousTerm = await db.terms.findFirst({
                        where: {
                            start: {
                                startsWith: year,
                            },
                            term_name: 'Second',
                        },
                    });

                    previousMark = await db.marks.findFirst({
                        where: {
                            institute_id: report.institute_id,
                            student_id: report.student_id,
                            term_id: previousTerm?.term_id,
                            subject_id: mark.subject_id,
                        },
                    });
                }

                //calculate change
                if (previousMark?.mark) {
                    change = mark.mark - previousMark.mark;
                }

                //calculate pass
                switch (true) {
                    case mark.mark >= 75:
                        pass = 'A';
                        break;
                    case mark.mark >= 65:
                        pass = 'B';
                        break;
                    case mark.mark >= 55:
                        pass = 'C';
                        break;
                    case mark.mark >= 35:
                        pass = 'S';
                        break;
                    case mark.mark < 35:
                        pass = 'W';
                        break;
                }

                const rank = findRank(report.id) + 1;

               

                switch (true) {
                    case report.terms.term_name === 'First':
                        nextTerm = await db.terms.findFirst({
                            where: {
                                start: {
                                    startsWith: year,
                                },
                                term_name: 'Second',
                            },
                        });

                        break;

                    case report.terms.term_name === 'Second':
                        nextTerm = await db.terms.findFirst({
                            where: {
                                start: {
                                    startsWith: year,
                                },
                                term_name: 'Third',
                            },
                        });

                        break;

                    case report.terms.term_name === 'Third':
                        let nextYearInt = parseInt(year) + 1;
                        let nextYear = nextYearInt.toString();
                        nextTerm = await db.terms.findFirst({
                            where: {
                                start: {
                                    startsWith: nextYear,
                                },
                                term_name: 'First',
                            },
                        });

                        break;
                }
                if(!report.teacher_id){
                    return new NextResponse('Report not found', { status: 403 });
                }
                await db.final_Report.create({
                    data: {
                        institute_id: mark.institute_id,
                        report_id: report.id,
                        student_id: report.student_id,
                        subject_id: mark.subject_id,
                        change: change,
                        pass: pass,
                        term_id: term_id,
                        mark: mark.mark,
                        total_marks: totalMarks?.total_marks,
                        total_students: report.total_students,
                        highest_total_mark: highest_total_mark._max.total_marks,
                        average: numericFormattedAverage,
                        rank: rank,
                        teacher_id: report.teacher_id,
                        teacher_signed_date: report.updatedAt,
                        principal_id: principalDetails.principal_id,
                        principal_signed_date: report.updatedAt,
                        next_term_start_date: nextTerm?.start,
                    },
                });
            }
            //get absent marks
            const absentMarks = await db.marks.findMany({
                where: {
                    student_id: report.student_id,
                    term_id: term_id,
                    absent: true,
                },
            });

            for (const mark of absentMarks) {
                if(!report.teacher_id){
                    return new NextResponse('Report not found', { status: 403 });
                }
                await db.final_Report.create({
                    data: {
                        institute_id: mark.institute_id,
                        report_id: report.id,
                        student_id: report.student_id,
                        subject_id: mark.subject_id,
                        pass: 'Ab',
                        term_id: term_id,
                        total_students: report.total_students,
                        highest_total_mark: highest_total_mark._max.total_marks,
                        average: numericFormattedAverage,
                        teacher_id:  report.teacher_id,
                        principal_id: principalDetails.principal_id,
                        principal_signed_date: report.updatedAt,
                        teacher_signed_date: report.updatedAt,
                        next_term_start_date: nextTerm?.start,
                    },
                });
            }
            const final_report = await db.final_Report.findMany({
                where: {
                    report_id: params.report_id,
                },
                include: {
                    subject: {
                        select: {
                            name: true,
                        },
                    },
                    teacher: {
                        select: {
                            full_name: true,
                        },
                    },
                    principal: {
                        select: {
                            full_name: true,
                        },
                    },
                    institute: {
                        select: {
                            institute_name: true,
                        },
                    },
                    student: {
                        include: {
                            classes: true,
                        },
                    },
                    terms: {
                        select: {
                            term_name: true,
                            start: true,
                        },
                    },
                    report: {
                        select: {
                            principal_signed: true,
                        },
                    },
                },orderBy:{
                    updatedAt: 'asc'
                }
            });

            const sortedFinalReport = final_report.sort((a, b) => {
                // Assuming 'column_value' refers to the column you're checking
                const columnValueA = a.pass;
                const columnValueB = b.pass;
            
                // If column value is 'AB', place it last
                if (columnValueA === 'Ab' && columnValueB !== 'Ab') return 1;
                if (columnValueA !== 'Ab' && columnValueB === 'Ab') return -1;
            
                // If neither is 'AB', maintain the original order
                if (columnValueA !== 'Ab' && columnValueB !== 'Ab') return 0;
            
                // If both are 'AB', maintain the original order
                return 0;
            });

            return NextResponse.json(sortedFinalReport, { status: 200 });
        }

        const final_report = await db.final_Report.findMany({
            where: {
                report_id: params.report_id,
            },
            include: {
                subject: {
                    select: {
                        name: true,
                    },
                },
                teacher: {
                    select: {
                        full_name: true,
                    },
                },
                principal: {
                    select: {
                        full_name: true,
                    },
                },
                institute: {
                    select: {
                        institute_name: true,
                    },
                },
                student: {
                    include: {
                        classes: true,
                    },
                },
                terms: {
                    select: {
                        term_name: true,
                        start: true,
                    },
                },
                report: {
                    select: {
                        principal_signed: true,
                    },
                },
            },orderBy:{
                updatedAt: 'asc'
            }
        });
        const sortedFinalReport = final_report.sort((a, b) => {
            // Assuming 'column_value' refers to the column you're checking
            const columnValueA = a.pass;
            const columnValueB = b.pass;
        
            // If column value is 'AB', place it last
            if (columnValueA === 'Ab' && columnValueB !== 'Ab') return 1;
            if (columnValueA !== 'Ab' && columnValueB === 'Ab') return -1;
        
            // If neither is 'AB', maintain the original order
            if (columnValueA !== 'Ab' && columnValueB !== 'Ab') return 0;
        
            // If both are 'AB', maintain the original order
            return 0;
        });
        
        return NextResponse.json(sortedFinalReport, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
