import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await req.json();
        console.log(body);
        const { nic, password, full_name, gender, grade, class_name, subjects_teacher, contact_number } = body;

        const uniqueNumber = await db.user_sequence.create({
            data: {},
        });
        const prefix = 'UST';

        const teacher_index = `${prefix}${uniqueNumber.id}`;

        const hashedPassword = await hash(password, 10);

        let newTeacher

        if (!grade || !class_name) {
            newTeacher = await db.teachers.create({
                data: {
                    index: teacher_index,
                    nic,
                    password: hashedPassword,
                    full_name: full_name,
                    gender: gender,
                    contact_number: contact_number,
                    institute_id: session?.user.id,
                    subject_teacher: true,
                },
            });
        }

        const classTeacher = await db.classes.findFirst({
            where: {
                grade_level: grade,
                class_name: class_name,
                institute_id: session.user.id,
            },
        });

        if (!classTeacher) {
            const newClass = await db.classes.create({
                data: {
                    grade_level: grade,
                    class_name: class_name,
                    institute_id: session?.user.id,
                },
            });
 
            newTeacher = await db.teachers.create({
                data: {
                    index: teacher_index,
                    nic,
                    password: hashedPassword,
                    full_name: full_name,
                    gender: gender,
                    contact_number: contact_number,
                    institute_id: session?.user.id,
                    class_id: newClass.class_id,
                    class_teacher: true,
                    subject_teacher: true,
                },
            });
        } else {
            const existClassTeacher = await db.teachers.findFirst({
                where: {
                    class_id: classTeacher?.class_id,
                },
            });

            if (existClassTeacher) {
                return new NextResponse('class teacher already exist', { status: 403 });
            }

            newTeacher = await db.teachers.create({
                data: {
                    index: teacher_index,
                    nic,
                    password: hashedPassword,
                    full_name: full_name,
                    gender: gender,
                    contact_number: contact_number,
                    institute_id: session?.user.id,
                    class_id: classTeacher?.class_id,
                    class_teacher: true,
                    subject_teacher: true,
                },
            });
        }

        for (const subject_teacher of subjects_teacher) {
            const existSubject = await db.subjects.findUnique({
                where: {
                    subject_id: subject_teacher.subject,
                },
            });

            if (!existSubject) {
                return new NextResponse('Subject does not exist', { status: 403 });
            }
            const existClass = await db.classes.findFirst({
                where: {
                    grade_level: subject_teacher.grade,
                    class_name: subject_teacher.class,
                    institute_id: session.user.id,
                },
            });

            if (!existClass) {
                const newClass = await db.classes.create({
                    data: {
                        grade_level: subject_teacher.grade,
                        class_name: subject_teacher.class,
                        institute_id: session?.user.id,
                    },
                });
                await db.teacher_subjects.create({
                    data: {
                        teacher_id: newTeacher.teacher_id,
                        class_id: newClass.class_id,
                        subject_id: existSubject.subject_id,
                        medium: subject_teacher.medium,
                    },
                });
            } else {
                await db.teacher_subjects.createMany({
                    data: {
                        teacher_id: newTeacher.teacher_id,
                        class_id: existClass.class_id,
                        subject_id: existSubject.subject_id,
                        medium: subject_teacher.medium,
                    },
                });
            }
        }
        return NextResponse.json(newTeacher, { status: 201 });
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

        const teachers = await db.teachers.findMany({
            include: {
                class: true,
                teacher_subjects: {
                    include: {
                        class: true,
                        subject: true,
                    },
                },
            },
        });
        return NextResponse.json(teachers, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
