import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        let heldYears = [];
        const years = await db.terms.findMany({
            where: {
                institute_id: session.user.id,
                term_name: 'First',
            },
            select: {
                start: true,
            },
        });

        for (const year of years) {
            heldYears.push(year.start.slice(0, 4))
        }

        return NextResponse.json(heldYears, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
