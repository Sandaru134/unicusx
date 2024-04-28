import { authOption } from '@/lib/auth';
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }
        const body = await req.json();
        const { nic, full_name, gender, type, grade, contact_number } = body;

        let uniqueNumber;

        const largestNumber = await db.principal_User_sequence.aggregate({
            _max: {
                number: true,
            },
        });

        if (largestNumber._max.number) {
            let newNumber = largestNumber._max.number + 1;

            uniqueNumber = await db.principal_User_sequence.create({
                data: {
                    number: newNumber,
                },
            });
        } else {
            let newNumber = 1;
            uniqueNumber = await db.principal_User_sequence.create({
                data: {
                    number: newNumber,
                },
            });
        }

        const prefix = 'USP';

        const principal_index = `${prefix}${uniqueNumber.number}`;



        const newPrincipal = await db.principals.create({
            data: {
                index: principal_index,
                nic,
                full_name,
                gender,
                type,
                grade,
                contact_number,
                institute_id: session.user.id,
            },
        });

        return NextResponse.json(newPrincipal, { status: 201 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const principals = await db.principals.findMany({
            where: {
                institute_id: session.user.id,
                left:false
            },
        });
        return NextResponse.json(principals, { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    } finally {
        db.$disconnect();
    }
}
