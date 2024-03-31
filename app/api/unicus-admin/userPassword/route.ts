import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOption);
        
        // if (!session) {
        //     return new NextResponse('Unauthenticated', { status: 403 });
        // }

        const body = await req.json();
        const { institute, user, type } = body;

        if (user === 'student') {
            const users = await db.students.findMany({
                where: {
                    institute: {
                        institute_type: institute,
                        type: type,
                    },
                },
            });

            return NextResponse.json(users);
        }
        if (user === 'teacher') {
            const users = await db.teachers.findMany({
                where: {
                    institute: {
                        institute_type: institute,
                        type: type,
                    },
                },
            });

            return NextResponse.json(users);
        }
        if (user === 'principal') {
            const users = await db.principals.findMany({
                where: {
                    institute: {
                        institute_type: institute,
                        type: type,
                    },
                },
            });

            return NextResponse.json(users);
        }
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    }finally{
        db.$disconnect()
    }
}
