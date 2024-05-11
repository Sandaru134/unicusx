import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { user_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        if (!params.user_id) {
            return new NextResponse('Institute id is required', { status: 400 });
        }

        const body = await req.json();
        const { password } = body;
        const hashedPassword = await hash(password, 10);
        const prefix = params.user_id.slice(0, 3);

        if (prefix === 'USS') {
            const updatedUser = await db.students.update({
                where: {
                    index: params.user_id,
                },
                data: {
                    nic: password,
                },
            });

            return NextResponse.json(updatedUser, { status: 200 });
        }

        if (prefix === 'UST') {
            const updatedUser = await db.teachers.update({
                where: {
                    index: params.user_id,
                },
                data: {
                    password: hashedPassword,
                },
            });

            return NextResponse.json(updatedUser, { status: 200 });
        }

        if (prefix === 'USB') {
            const updatedUser = await db.teachers.update({
                where: {
                    index: params.user_id,
                },
                data: {
                    password: hashedPassword,
                },
            });

            return NextResponse.json(updatedUser, { status: 200 });
        }

        if (prefix === 'USH') {
            const updatedUser = await db.institute_admin.update({
                where: {
                    index: params.user_id,
                },
                data: {
                    password: hashedPassword,
                },
            });

            return NextResponse.json(updatedUser, { status: 200 });
        }

        if (prefix === 'USL') {
            const updatedUser = await db.institute_admin.update({
                where: {
                    index: params.user_id,
                },
                data: {
                    password: hashedPassword,
                },
            });

            return NextResponse.json(updatedUser, { status: 200 });
        }

        if (prefix === 'USN') {
            const updatedUser = await db.institute_admin.update({
                where: {
                    index: params.user_id,
                },
                data: {
                    password: hashedPassword,
                },
            });

            return NextResponse.json(updatedUser, { status: 200 });
        }

        return new NextResponse('Invalid user id', { status: 403 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
