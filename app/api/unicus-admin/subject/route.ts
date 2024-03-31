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
        const { name, institute_type, category } = body;

        const newName = `${name}-${category}`;

        const newSubject = await db.subjects.create({
            data: {
                name:newName,
                institute_type,
                category,
            },
        });

        const institutes = await db.institutes.findMany({
            select: {
                institute_id: true,
            },
        });

        for (const institute of institutes) {
            await db.institute_subject_status.create({
                data: {
                    institute_id: institute.institute_id,
                    subject_id: newSubject.subject_id,
                },
            });
        }

        return NextResponse.json(newSubject, { status: 201 });
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

        const subjects = await db.subjects.findMany();
        return NextResponse.json(subjects);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
