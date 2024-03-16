import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, password, image_url } = body;

        const uniqueNumber = await db.user_sequence.create({
            data:{}
        });
        const prefix = 'USX'

        const username = `${prefix}${uniqueNumber.id}`;

        const existUserById = await db.user.findUnique({
            where: { username: username },
        });

        if (existUserById) {
            return NextResponse.json({ user: null, massage: 'User with this id already exist' }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await db.user.create({
            data: {
                username: username,
                password: hashedPassword,
                name,
                image_url,
                prefix: prefix
            },
        });

        const { password: newUserPassword, ...rest } = newUser;
        return NextResponse.json({user: rest, massage:"User create successfully"}, {status:201});
    } catch (error) {
        console.log(error);
    }
}
