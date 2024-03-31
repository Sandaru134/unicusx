import { authOption } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { student_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const existStudent = await db.students.findUnique({
            where:{
                student_id: params.student_id
            }
        })

        if (!existStudent) {
            return new NextResponse('Unautherized', { status: 403 });
        }

        const body = await req.json();

        const { nic, full_name, gender, date_of_birth, grade, class_name, medium, guardian_nic, contact_number } = body;

        const institute = await db.institutes.findFirst({
            where: {
                institute_id: session.user.id,
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
        const studentClass = await db.classes.findFirst({
            where: {
                grade_level: grade,
                class_name: class_name,
            },
        });

        if(!studentClass){
            const newClass = await db.classes.create({
                data: {
                    grade_level: grade,
                    class_name: class_name,
                    institute_id: session.user.id,
                },
            });

            const updatedStudent = await db.students.update({
                where:{
                    student_id:params.student_id
                },
                data: {
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

            return NextResponse.json(updatedStudent, { status: 200 });
        }

        const updatedStudent = await db.students.update({
            where:{
                student_id:params.student_id
            },
            data: {
                nic,
                full_name,
                gender,
                date_of_birth,
                medium,
                guardian_nic,
                student_type,
                contact_number,
                institute_id: session.user.id,
                class_id: studentClass.class_id,
            },
        });

        return NextResponse.json(updatedStudent, { status: 200 });

    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    }finally {
        db.$disconnect();
    }
}