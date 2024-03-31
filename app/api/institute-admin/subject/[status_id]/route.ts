import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { status_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        if (!params.status_id) {
            return new NextResponse('Status id is required', { status: 400 });
        }

        const status = await db.institute_subject_status.findFirst({
            where: {
                id: params.status_id,
            },
        });

        if (status?.status === false) {
            const updatedStatus = await db.institute_subject_status.update({
                where: {
                    id: params.status_id,
                },
                data: {
                    status: true,
                },
            });

            return NextResponse.json(updatedStatus, { status: 200 });
        }

        const updatedStatus = await db.institute_subject_status.update({
            where: {
                id: params.status_id,
            },
            data: {
                status: false,
            },
        });

        return NextResponse.json(updatedStatus, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
