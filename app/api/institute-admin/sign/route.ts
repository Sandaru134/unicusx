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

        const { year, term_name, grade_level } = body;


        const term = await db.terms.findFirst({
            where: {
                institute_id: session.user.id,
                start: {
                    startsWith: year,
                },
                term_name: term_name,
                completed: true,
            },
        });
        
        if (!term) {
            return new NextResponse('Term not completed', { status: 403 });
        }

        const classes = await db.term_class.findMany({
            where: {
                institute_id: session.user.id,
                term_id: term?.term_id,
                class: {
                    grade_level: grade_level,
                },
            },
            include: {
                class: {
                    select: {
                        class_name: true,
                    },
                },
            },
        });

        return NextResponse.json(classes, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
