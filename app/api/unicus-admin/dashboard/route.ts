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

        const instituteStudents = await db.students.aggregate({
            _count: true,
        });

        const instituteTeachers = await db.teachers.aggregate({
            _count: true,
        });

        const institutePrincipal = await db.principals.aggregate({
            _count: true,
        });

        const allUsers = instituteStudents._count + instituteTeachers._count + institutePrincipal._count;

        const response = [
            {
                students: instituteStudents._count,
                teachers: instituteTeachers._count,
                principals: institutePrincipal._count,
                all_users: allUsers,
            },
        ];

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
