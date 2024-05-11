import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { teacher_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return NextResponse.json({message:'Unauthenticated'}, { status: 403 });
        }

        const body = await req.json();

        const { nic, name, gender, grade, class_name, subjects_teacher, contact } = body;

        let updatedTeacher;

        const teacher = await db.teachers.findFirst({
            where: {
                teacher_id: params.teacher_id,
            },
        });

        if (!teacher) {
            return NextResponse.json({message:'Unautherized'}, { status: 403 });
        }
        
        if (!grade && !class_name) {
            updatedTeacher = await db.teachers.update({
                where: {
                    teacher_id: params.teacher_id,
                },
                data: {
                    nic: nic,
                    full_name: name,
                    gender: gender,
                    contact_number: contact,
                    subject_teacher: true,
                    class_teacher: false,
                },
            });

            await db.teacher_subjects.deleteMany({
                where:{
                    teacher_id:params.teacher_id
                }
            })

            for (const subject_teacher of subjects_teacher) {
                const subject = await db.subjects.findFirst({
                    where: {
                        subject_id: subject_teacher.subject,
                    },
                });
                
                if (!subject) {
                    return  NextResponse.json({message:'Subject does not exist'}, { status: 403 });
                }

                const existClass = await db.classes.findFirst({
                    where: {
                        grade_level: subject_teacher.grade,
                        class_name: subject_teacher.class,
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
                            teacher_id: params.teacher_id,
                            class_id: newClass.class_id,
                            medium: subject_teacher.medium,
                            subject_id: subject.subject_id,
                        },
                    });
                } else {
                    await db.teacher_subjects.create({
                        data: {
                            teacher_id: params.teacher_id,
                            class_id: existClass.class_id,
                            medium: subject_teacher.medium,
                            subject_id: subject.subject_id,
                        },
                    });
                }
            }

            return NextResponse.json(updatedTeacher, { status: 200 });
        }

        //with class teacher

        let prefix;
        let teacher_index;

        if (!teacher.class_id) {
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

            prefix = 'UST';
            teacher_index = `${prefix}${uniqueNumber.number}`;
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

            updatedTeacher = await db.teachers.update({
                where: {
                    teacher_id: params.teacher_id,
                },
                data: {
                    index: teacher_index,
                    nic,
                    full_name: name,
                    gender,
                    contact_number: contact,
                    class_id: newClass.class_id,
                    subject_teacher: true,
                    class_teacher: true,
                },
            });

        } else {
            //check class teacher
            if(teacher.class_id !== classTeacher.class_id){
                const existClassTeacher = await db.teachers.findFirst({
                    where: {
                        institute_id: session.user.id,
                        left: false,
                        class_id: classTeacher?.class_id,
                    },
                });
                
                if (existClassTeacher) {
                    return NextResponse.json({message:'Class teacher already exist'}, { status: 403 });
                }
            }
            
            
            updatedTeacher = await db.teachers.update({
                where: {
                    teacher_id: params.teacher_id,
                },
                data: {
                    nic,
                    full_name: name,
                    gender,
                    contact_number: contact,
                    class_id: classTeacher.class_id,
                    institute_id: session.user.id,
                },
            });
        }

        await db.teacher_subjects.deleteMany({
            where: {
                teacher_id: params.teacher_id,
            },
        });

        for (const subject_teacher of subjects_teacher) {
            const subject = await db.subjects.findFirst({
                where: {
                    subject_id: subject_teacher.subject,
                },
            });
            
            if (!subject) {
                return NextResponse.json({message:'Subject does not exist'}, { status: 403 });
            }

            const existClass = await db.classes.findFirst({
                where: {
                    grade_level: subject_teacher.grade,
                    class_name: subject_teacher.class,
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
                        teacher_id: params.teacher_id,
                        class_id: newClass.class_id,
                        medium: subject_teacher.medium,
                        subject_id: subject.subject_id,
                    },
                });
            } else {
                await db.teacher_subjects.create({
                    data: {
                        teacher_id: params.teacher_id,
                        class_id: existClass.class_id,
                        medium: subject_teacher.medium,
                        subject_id: subject.subject_id,
                    },
                });
            }
        }

        return NextResponse.json(updatedTeacher, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:'Internal error'}, { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function GET(req: Request, { params }: { params: { teacher_id: string } }) {
    try {
        const session = await getServerSession(authOption);
        
        if (!session) {
            return NextResponse.json('Unauthenticated', { status: 403 });
        }

        const teacher = await db.teachers.findUnique({
            where: {
                teacher_id: params.teacher_id,
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

        return NextResponse.json(teacher, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:'Internal error'}, { status: 500 });
    } finally {
        db.$disconnect();
    }
}
