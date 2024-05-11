import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { message } from 'antd';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const body = await req.json();

        const { grade_level, term_name } = body;

        //get report
        const report = await db.report.findFirst({
            where: {
                student_id: session.user.id,
                class: {
                    grade_level: grade_level,
                },
                terms: {
                    term_name: term_name,
                },
                completed:true
            },
            include: {
                student: true,
                institute: true,
            },
        });
        if (!report) {
            return NextResponse.json({message:'Report not found'}, { status: 403 });
        }
        return NextResponse.json(report, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
