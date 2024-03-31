import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { institute_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        if (!params.institute_id) {
            return new NextResponse('Institute id is required', { status: 400 });
        }

        const institute = await db.institutes.findUnique({
            where: {
                institute_id: params.institute_id,
            },
        });
        return NextResponse.json(institute);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function DELETE(req: Request, { params }: { params: { institute_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        if (!params.institute_id) {
            return new NextResponse('Product id is required', { status: 400 });
        }

        const instituteById = await db.institutes.findFirst({
            where: {
                institute_id: params.institute_id,
            },
        });
        if (!instituteById) {
            return new NextResponse('Unauthorized', { status: 405 });
        }
        const deleteInstitute = await db.institutes.delete({
            where: {
                institute_id: params.institute_id,
            },
        });
        return NextResponse.json(deleteInstitute);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function PATCH(req: Request, { params }: { params: { institute_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await req.json();
        const { institute_initial, institute_name, gender, institute_type, type, from, to, contact_number, password } = body;

        const institute = await db.institutes.findFirst({
            where: {
                institute_id: params.institute_id,
            },
        });
        if (!institute) {
            return new NextResponse('Unautherized', { status: 403 });
        }

        await db.institutes.update({
            where: {
                institute_id: params.institute_id,
            },
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

        await db.institute_admin.update({
            where: {
                institute_id: params.institute_id,
            },
            data: {
                password,
            },
        });

        const updatedRecord = await db.institutes.findUnique({
            where: {
                institute_id: params.institute_id,
            },
            include: {
                institute_admin: true,
            },
        });

        return NextResponse.json(updatedRecord);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
