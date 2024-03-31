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
        const { nic, full_name, gender, date_of_birth, grade, class_name, medium, guardian_nic, contact_number } = body;

        const institute = await db.institutes.findFirst({
            where: {
                institute_id: session?.user.id,
            },
        });

        let student_type: string = '';

        if (institute?.institute_type === 'school') {
            if (grade >= 1 && grade <= 5) {
                student_type = 'Primary';
            }
            if (grade >= 6 && grade <= 9) {
                student_type = 'Junior Secondary';
            }
            if (grade >= 10 && grade <= 11) {
                student_type = 'Senior Secondary';
            }
            if (grade >= 12 && grade <= 13) {
                student_type = 'Collegiate';
            }
        }

        if (institute?.institute_type === 'preschool') {
            student_type = 'Kindergarten';
        }

        const uniqueNumber = await db.user_sequence.create({
            data: {},
        });
        let newStudent;
        const prefix = 'USS';

        const student_index = `${prefix}${uniqueNumber.id}`;

        const existUserById = await db.students.findUnique({
            where: { index: student_index },
        });

        if (existUserById) {
            return NextResponse.json({ user: null, massage: 'User with this id already exist' }, { status: 409 });
        }

        const studentClass = await db.classes.findFirst({
            where: {
                grade_level: grade,
                class_name: class_name,
            },
        });

        if (!studentClass) {
            const newClass = await db.classes.create({
                data: {
                    grade_level: grade,
                    class_name: class_name,
                    institute_id: session.user.id,
                },
            });

            newStudent = await db.students.create({
                data: {
                    index: student_index,
                    nic,
                    full_name,
                    gender,
                    date_of_birth,
                    medium,
                    guardian_nic,
                    student_type,
                    contact_number,
                    institute_id: session.user.id,
                    class_id: newClass.class_id,
                },
            });
        } else {
            newStudent = await db.students.create({
                data: {
                    index: student_index,
                    nic,
                    full_name,
                    gender,
                    date_of_birth,
                    medium,
                    student_type,
                    guardian_nic,
                    contact_number,
                    institute_id: session.user.id,
                    class_id: studentClass.class_id,
                },
            });
        }

        const subjects = await db.institute_subject_status.findMany({
            where: {
                institute_id: session.user.id,
                status: true,
            },
            include: {
                subject: true,
            },
        });

        for (const subject of subjects) {
            await db.student_subjects_Status.create({
                data: {
                    student_id: newStudent.student_id,
                    subject_id: subject.subject.subject_id,
                    institute_id: session.user.id,
                    class_id: newStudent.class_id,
                },
            });
        }

        return NextResponse.json(newStudent, { status: 201 });
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

        const students = await db.students.findMany({
            where: {
                institute_id: session.user.id,
            },
            include: {
                classes: {
                    select: {
                        grade_level: true,
                        class_name: true,
                    },
                },
            },
        });

        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
