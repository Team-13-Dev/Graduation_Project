import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { fullName, role, companyName, companyIndustry, notifyEmail, notifyInApp, insightFrequency } = await req.json();
    try{
        const clerkUser = await currentUser();
        if (!clerkUser) return NextResponse.json({message: "Unauthorized"}, { status: 401 });
        //سيبها دلوقتي واحنا بنعمل test
            //   const existing = await db.query.users.findFirst({
                //     where: eq(users.id, clerkUser.id),
                //   });
                
        await db.insert(users).values({
            fullName,
            email: clerkUser.primaryEmailAddress?.emailAddress!,
            passwordHash: "", //ممكن نحتاجها لو هنعمل manual auth في الموبيل ابلكيشن فا سيبها
            role,
            companyName,
            companyIndustry,
            notifyEmail,
            notifyInApp,
            insightFrequency,
        });
        
        return NextResponse.json({ message: "User created"}, { status: 200})
    }catch(error: unknown){
        console.error(error);

        if (error instanceof Error) {
            return NextResponse.json(
            { message: `Internal server error: ${error.message}` },
            { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }

}
