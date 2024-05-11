import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { index: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return NextResponse.json({message:'Unauthenticated'}, { status: 403 });
        }

        if (!params.index) {
            return NextResponse.json({message:'Unautherized'}, { status: 403 });
        }

        const currentDate = new Date();

        const prefix = params.index.slice(0, 3);

        if (prefix === 'USP') {
            const updatedPrincipal = await db.principals.update({
                where: {
                    index: params.index,
                },
                data: {
                    left: true,
                    date_of_resignation: currentDate,
                },
            });

            return NextResponse.json(updatedPrincipal, { status: 200 });
        }
        if (prefix === 'UST') {
            const updatedTeacher = await db.teachers.update({
                where: {
                    index: params.index,
                },
                data: {
                    left: true,
                    date_of_resignation: currentDate,
                },
            });

            return NextResponse.json(updatedTeacher, { status: 200 });
        }

        if (prefix === 'USB') {
            const updatedTeacher = await db.teachers.update({
                where: {
                    index: params.index,
                },
                data: {
                    left: true,
                    date_of_resignation: currentDate,
                },
            });

            return NextResponse.json({message:updatedTeacher}, { status: 200 });
        }

        if (prefix === 'USS') {
            const updatedStudent = await db.students.update({
                where: {
                    index: params.index,
                },
                data: {
                    left: true,
                    date_of_resignation: currentDate,
                },
            });

            const uncomletedTerms = await db.terms.findMany({
                where: {
                    institute_id: session.user.id,
                    completed: false,
                },
            });

            await db.student_subjects_Status.deleteMany({
                where: {
                    student_id: updatedStudent.student_id,
                },
            });

            for (const term of uncomletedTerms) {
                await db.report.deleteMany({
                    where: {
                        student_id: updatedStudent.student_id,
                        term_id: term.term_id,
                    },
                    
                })
                await db.marks.deleteMany({
                    where: {
                        student_id: updatedStudent.student_id,
                        term_id: term.term_id,
                    },
                });
            }

            return NextResponse.json(updatedStudent, { status: 200 });
        }

        return NextResponse.json({message:'Unautherized'}, { status: 403 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:'Internal error'}, { status: 500 });
    } finally {
        db.$disconnect();
    }
}
