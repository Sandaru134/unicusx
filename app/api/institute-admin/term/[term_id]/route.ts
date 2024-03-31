import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { term_id: string } }) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await req.json();
        console.log(body);
        const { term_name, start, end } = body;

        const term = await db.terms.findFirst({
            where: {
                term_id: params.term_id,
            },
        });

        if (!term) {
            return new NextResponse('Unautherized', { status: 403 });
        }

        const updatedTerm = await db.terms.update({
            where: {
                term_id: params.term_id,
            },
            data: {
                term_name,
                start,
                end,
            },
        });

        return NextResponse.json(updatedTerm, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
