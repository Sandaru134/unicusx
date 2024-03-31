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
        console.log(session);

        const body = await req.json();
        const { institute_initial, institute_name, gender, institute_type, type, from, to, contact_number, password } = body;

        const uniqueNumber = await db.user_sequence.create({
            data: {},
        });
        const prefix = 'USH';

        const index = `${prefix}${uniqueNumber.id}`;

        const hashedPassword = await hash(password, 10);

        const newInstitute = await db.institutes.create({
            data: {
                institute_initial,
                institute_name,
                gender,
                institute_type,
                type,
                from,
                to,
                contact_number,
            },
        });

        await db.institute_admin.create({
            data: {
                institute_id: newInstitute.institute_id,
                index: index,
                password: hashedPassword,
            },
        });

        const subjects = await db.subjects.findMany();

        for (const subject of subjects) {
            const status = await db.institute_subject_status.create({
                data: {
                    institute_id: newInstitute.institute_id,
                    subject_id: subject.subject_id,
                },
            });
        }

        return NextResponse.json({ Institute: newInstitute }, { status: 201 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const institutes = await db.institutes.findMany({
            include: {
                institute_admin: true,
            },
        });
        return NextResponse.json(institutes);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
