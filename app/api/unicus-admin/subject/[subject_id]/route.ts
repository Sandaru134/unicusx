import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { subject_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        if (!params.subject_id) {
            return new NextResponse('Subject id is required', { status: 400 });
        }

        const subject = await db.subjects.findUnique({
            where: {
                subject_id: params.subject_id,
            },
        });

        return NextResponse.json(subject);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function DELETE(req: Request, { params }: { params: { subject_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        if (!params.subject_id) {
            return new NextResponse('Subject id is required', { status: 400 });
        }

        const subjectById = await db.subjects.findFirst({
            where: {
                subject_id: params.subject_id,
            },
        });

        if (!subjectById) {
            return new NextResponse('Unauthorized', { status: 405 });
        }

        const deletedSubject = await db.subjects.delete({
            where: {
                subject_id: params.subject_id,
            },
        });
        return NextResponse.json(deletedSubject, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function PATCH(req: Request, { params }: { params: { subject_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await req.json();
        const { name, institute_type, category } = body;

        const subjectById = await db.subjects.findUnique({
            where: {
                subject_id: params.subject_id,
            },
        });

        if (!subjectById) {
            return new NextResponse('Unautherized', { status: 403 });
        }

        let newName;

        if (subjectById.name !== name || subjectById.category !== category) {
            const subjectName = subjectById.name.split('-')[0] || ''
            newName = `${subjectName}-${category}`;
        }

        await db.subjects.update({
            where: {
                subject_id: params.subject_id,
            },
            data: {
                name: newName,
                institute_type,
                category,
            },
        });

        const updatedSubject = await db.subjects.findUnique({
            where: {
                subject_id: params.subject_id,
            },
            include: {
                institute: true,
            },
        });

        return NextResponse.json(updatedSubject, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
