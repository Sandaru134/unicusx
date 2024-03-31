import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { index: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        if (!params.index) {
            return new NextResponse('Unautherized', { status: 403 });
        }
        const currentDate = new Date();
        const prefix = params.index.slice(0, 3);

        if (prefix === 'USP') {
            const updatedPrincipal = await db.principals.update({
                where: {
                    index: params.index,
                },
                data: {
                    left: true,
                    date_of_resignation: currentDate,
                },
            });

            return NextResponse.json(updatedPrincipal, { status: 200 });
        }
        if (prefix === 'UST') {
            const updatedTeacher = await db.teachers.update({
                where: {
                    index: params.index,
                },
                data: {
                    left: true,
                    date_of_resignation: currentDate,
                },
            });

            return NextResponse.json(updatedTeacher, { status: 200 });
        }

        if (prefix === 'USS') {
            const updatedStudent = await db.students.update({
                where: {
                    index: params.index,
                },
                data: {
                    left: true,
                    date_of_resignation: currentDate,
                },
            });

            return NextResponse.json(updatedStudent, { status: 200 });
        }

        return new NextResponse('Unautherized', { status: 403 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
