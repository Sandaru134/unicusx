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
        const { term_name, start, end } = body;

        const newTerm = await db.terms.create({
            data: {
                term_name,
                start,
                end,
                institute_id: session.user.id,
            },
        });

        const classes = await db.classes.findMany({
            where: {
                institute_id: session.user.id,
            },
        });

        for (const instituteClass of classes) {
            await db.term_class.create({
                data: {
                    term_id: newTerm.term_id,
                    class_id: instituteClass.class_id,
                },
            });
        }

        const addedStudents = await db.student_subjects_Status.findMany({
            where: {
                added: true,
                completed: false,
            },
        });

        for (const addedStudent of addedStudents) {
            await db.marks.create({
                data: {
                    student_subject_id: addedStudent.id,
                    term_id: newTerm.term_id,
                    institute_id: session.user.id,
                    class_id: addedStudent.class_id,
                },
            });
        }

        const students = await db.students.findMany({
            where: {
                institute_id: session.user.id,
            }
        })
        for(const student of students){
            await db.report.create({
                data: {
                    student_id: student.student_id,
                    term_id: newTerm.term_id,
                    institute_id: session.user.id,
                    class_id: student.class_id,
                }
            })
        }

        return NextResponse.json(newTerm, { status: 201 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const terms = await db.terms.findMany({
            where: {
                institute_id: session.user.id,
            },
        });

        return NextResponse.json(terms, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
