import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";
import Link from "next/link";

//新規会員登録するserver action
//<form action={}>に渡すことでフォーム送信時にサーバー側で実行される

export default function UserRegister(){
    async function userRegister(formData: FormData){
        "use server";

        const user_name =formData.get("user_name") as string;
        const password = formData.get("password") as string;

        
        //ユーザーの重複がないかの確認
        const existingUser = await prisma.user.findUnique({
            where:{
                user_name: user_name
            },
        });

        if(existingUser){
            redirect(`/register`);
        }
        //本当にこのままでいいのか。名前がない時点でいきなりregisterに飛ばされるんかな？
        //今はバリデーションを追加しないと決めたからか

        //上で重複があればregisterへ飛ぶようにしたため、この処理になるときにはユーザーネームに被りがない。
        const user = await prisma.user.create({
            data:{
                user_name,
                password,
            },
        });
        redirect(`/start/${user.id}`);
    }

    return(
        <div>
            <Link href="/login">
            ← ログイン画面に戻る
            </Link>
            <h1>新規ユーザーを登録</h1>
            <form action={userRegister}>
                <div>
                    <label>ユーザー名: </label>
                    <input
                    name="user_name"
                    required/>
                </div>

                <div>
                    <label>パスワード: </label>
                    <input
                    name="password"
                    type="password"
                    required/>
                </div>
                <div>
                    <button type="submit">新規登録する</button>
                    <Link href="/login">キャンセル</Link>
                </div>
            </form>
        </div>
    )
}