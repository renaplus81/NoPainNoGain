//ログインユーザーIDを返す関数(誰かを調べる関数を1つにまとめちゃえばsession導入するときに楽？)
//今まではcookieとパラーメータのuserIdを照らし合わせることしかしていない(?)

import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getLoggedInUserId(){
    

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if(!sessionId){
        return null;
    }


    const session = await prisma.session.findUnique({
        where: {id: sessionId},
    })

    if(!session){
        return null;
    }
    
    return session.user_id;
}