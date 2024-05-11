import { authOption } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOption);

        if (!session) {
            return new NextResponse('Unauthenticated', { status: 403 });
        }

        const institute_id = await db.teachers.findUnique({
            where: {
                teacher_id: session.user.id,
            }
        })

        if(!institute_id){
            return new NextResponse('teacher not found', { status: 403 });
        }

        const terms = await db.terms.findMany({
            
            where: {
                institute_id:institute_id.institute_id,
                completed:false
            },select:{
                term_id:true,
                term_name:true
            }
        })

        return NextResponse.json(terms,{status:200});
    }catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    }finally {
        db.$disconnect();
    }
}