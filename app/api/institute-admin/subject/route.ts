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

        const instituteSubjects = await db.institutes.findUnique({
            where: {
                institute_id: session?.user.id,
            },
            include: {
                subject_status: {
                    include: {
                        subject: {
                            select: {
                                category: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(instituteSubjects, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
