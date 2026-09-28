//ログインユーザーIDを返す関数(誰かを調べる関数を1つにまとめちゃえばsession導入するときに楽？)
//今まではcookieとパラーメータのuserIdを照らし合わせることしかしていない(?)

import { cookies } from "next/headers";

export async function getLoggedInUserId(){
    const cookieStore = await cookies();
    const value = cookieStore.get("userId")?.value;

    if(!value){
        return null;
    }
    //
    return Number(value);

}