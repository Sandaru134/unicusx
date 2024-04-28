import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, password } = body;

        let uniqueNumber
        
        const largestNumber = await db.unicus_User_sequence.aggregate({
            _max:{
                number:true
            }
        })

        if(largestNumber._max.number){
            let newNumber = largestNumber._max.number +1;

            uniqueNumber = await db.unicus_User_sequence.create({
                data: {
                    number:newNumber
                },
            })
    
        }else{
            let newNumber = 1
            uniqueNumber = await db.unicus_User_sequence.create({
                data: {
                    number:newNumber
                },
            })
        }

        const prefix = 'USX'

        const username = `${prefix}${uniqueNumber.number}`;
        
        const existUserById = await db.unicus_admin.findUnique({
            where: { username: username },
        });

        if (existUserById) {
            return NextResponse.json({ user: null, massage: 'User with this id already exist' }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await db.unicus_admin.create({
            data: {
                username: username,
                password: hashedPassword,
                name
            },
        });

        const { password: newUserPassword, ...rest } = newUser;
        return NextResponse.json({user: rest, massage:"User create successfully"}, {status:201});
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    }finally{
        db.$disconnect()
    }
}
