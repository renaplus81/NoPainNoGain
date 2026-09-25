import {prisma} from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export default function LoginPage(){
    async function loginUser(formData: FormData){
        "use server";

        //as stringは、ある値が確実に文字列(string)型であることをコンパイラに保証するため
        const user_name=formData.get("user_name") as string;
        const password=formData.get("password") as string;


        const user = await prisma.user.findFirst({
            where:{
                user_name:user_name,
                // password:password,
            },
        })


        if(!user){
            redirect(`/login`); //ユーザーが見つからない場合
        }

        //user.をつけ忘れてエラーになっていた
        const isValid = await bcrypt.compare(password, user.hashedPassword);




        if(isValid){        //ここにクッキーの書き込み追加するらしい(ログインできるかどうか判断しているから)
            const cookieStore = await cookies();
            cookieStore.set("useId", String(user.id));

            redirect(`/start/${user.id}`);
        }else{
            redirect(`/login`);
        }

    }

    return(
        <div>
            <div>
                <form action={loginUser}>
                    <div>
                        <h2>ログイン画面</h2>
                    </div>
                    <div>
                        <label>ユーザーネーム </label>
                        <input 
                        name="user_name"
                        placeholder="ここに入力"
                        className="border border-gray-300 rounded "
                        required />
                    </div>

                    <div>
                    <label>パスワード </label>
                    <input
                    name="password"
                    type="password"
                    className="border border-gray-300 rounded"
                    required />
                    </div>

                    
                    <button type="submit">
                        ログインする
                    </button>

                    <p>
                        <Link href={`/register`}>
                            初めて遊ぶ方はこちら
                        </Link>
                    </p>


                </form>
            </div>
        </div>
    );
}