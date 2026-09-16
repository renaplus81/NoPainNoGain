import {prisma} from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function LoginPage(){
    async function loginUser(formData: FormData){
        "use server";

        //as stringは、ある値が確実に文字列(string)型であることをコンパイラに保証するため
        const user_name=formData.get("user_name") as string;
        const password=formData.get("password") as string;

        const user = await prisma.user.findFirst({
            where:{
                user_name:user_name,
                password:password,
            },
        })

        if(user){
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

                </form>
            </div>
        </div>
    );
}