import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await req.json();
        const { nic, password, full_name, gender, grade, class_name, subjects_teacher, contact_number } = body;

        //validate subjects_teacher
        for (const subject_teacher of subjects_teacher) {
            if (!subject_teacher.subject || !subject_teacher.grade || !subject_teacher.class || !subject_teacher.medium) {
                return NextResponse.json({ message: 'Invalid data' }, { status: 403 });
            }
        }

        let uniqueNumber;

        const largestNumber = await db.teacher_User_sequence.aggregate({
            _max: {
                number: true,
            },
        });

        if (largestNumber._max.number) {
            let newNumber = largestNumber._max.number + 1;

            uniqueNumber = await db.teacher_User_sequence.create({
                data: {
                    number: newNumber,
                },
            });
        } else {
            let newNumber = 1;
            uniqueNumber = await db.teacher_User_sequence.create({
                data: {
                    number: newNumber,
                },
            });
        }

        let prefix;
        let teacher_index;

        const hashedPassword = await hash(password, 10);

        let newTeacher;

        //without class teacher
        if (!grade || !class_name) {
            prefix = 'USB';

            teacher_index = `${prefix}${uniqueNumber.number}`;

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

            for (const subject_teacher of subjects_teacher) {
                const existSubject = await db.subjects.findUnique({
                    where: {
                        subject_id: subject_teacher.subject,
                    },
                });

                if (!existSubject) {
                    return NextResponse.json({ message: 'Subject does not exist' }, { status: 403 });
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
        }

        //with class teacher
        prefix = 'UST';
        teacher_index = `${prefix}${uniqueNumber.number}`;

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
                    institute_id: session.user.id,
                    left: false,
                    class_id: classTeacher?.class_id,
                },
            });

            if (existClassTeacher) {
                return NextResponse.json({ message: 'Class teacher already exist' }, { status: 403 });
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
                return NextResponse.json({ message: 'Subject does not exist' }, { status: 403 });
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
        return NextResponse.json({ message: 'Internal error' }, { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return NextResponse.json({ message: 'Unauthenticated' }, { status: 403 });
        }

        const teachers = await db.teachers.findMany({
            where: {
                institute_id: session.user.id,
                left: false,
            },
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
        return NextResponse.json({ message: 'Internal error' }, { status: 500 });
    } finally {
        db.$disconnect();
    }
}
