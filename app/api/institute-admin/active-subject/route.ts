import { authOption } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {

        const session = await getServerSession(authOption);
        
        if (!session) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        const activeSubject = await db.institute_subject_status.findMany({
            where:{
                institute_id:session.user.id,
                status:true
            },include:{
                subject:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return NextResponse.json(activeSubject,{status:200})
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal error', { status: 500 });
    }finally {
        db.$disconnect();
    }
}