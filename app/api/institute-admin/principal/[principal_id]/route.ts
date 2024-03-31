import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { principal_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await req.json();

        const { nic, full_name, gender, type, grade, contact_number } = body;

        const existPrincipal = await db.principals.findUnique({
            where: {
                principal_id: params.principal_id,
            },
        });
        if (!existPrincipal) {
            return new NextResponse('Unautherized', { status: 403 });
        }

        const updatedPrincipal = await db.principals.update({
            where: {
                principal_id: params.principal_id,
            },
            data: {
                nic,
                full_name,
                gender,
                type,
                grade,
                contact_number,
            },
        });

        return NextResponse.json(updatedPrincipal, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
