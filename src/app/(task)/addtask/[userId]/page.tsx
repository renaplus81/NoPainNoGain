import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";
import Link from "next/link";

import { getLoggedInUserId } from "@/lib/auth";

//タスクの新規追加

type Props = {
    params: Promise<{ userId: string }>;
};

export default async function RegisterNewTask({params}:Props){
        const { userId } = await params;

        //ログイン中のユーザーとURLのuserIdが一致するか確認する
        const loggedInUserId = await getLoggedInUserId();
        if(loggedInUserId !== Number(userId)){
            redirect("/login");
        }

    async function RegisterTask(formData:FormData){
        "use server";

        //Serveractionは外から直接呼べるのでここでも確認する
        //user_idはURLではなく、ログイン中のユーザーIDから決める(元もとNumber(userId);だったため)
        const currentUserId = await getLoggedInUserId();
        if(currentUserId === null){
            return;
        }


        //paramsからとったuserIdがあるので、それを使う。
        const user_id = currentUserId;
        //as stringは、ある値が確実に文字列(string)型であることをコンパイラに保証するため
        const task_name = formData.get("task_name") as string;
        //Number()を追加、フォーム入力のものは文字列型で返ってくるため
        const duration = Number(formData.get("duration") as string);
        const irrational = Number(formData.get("irrational") as string);

        const makesureTitle = await prisma.task.findFirst({
            where:{ 
                task_name: task_name,
                user_id: user_id,
            },
        });



        if(makesureTitle){
            redirect(`/alltask/${user_id}`);
        }

        const createTask = await prisma.task.create({
            data:{ 
                user_id,
                task_name,
                duration,
                irrational, 
            },
        });

        
        redirect(`/alltask/${user_id}`);
    }

    return (
        // ここのuser_idがえらー
        //タスク登録しているのに表示されない
        <div>
            <Link href={`/alltask/${userId}`}>
            {/*  */}
            ←タスク一覧画面へ
            </Link>

            <h1>タスクを新規登録</h1>

            <form action={RegisterTask}> 
                <div>
                    <label>タスク名: </label>
                    <input
                    name="task_name"
                    required />
                </div>
                <div>
                    <label>所要時間: </label>
                    <input
                    name="duration"
                    required />
                </div>
                <div>
                    <label>理不尽度合い: </label>
                    <input
                    name="irrational"
                    required />
                </div>


                <div>
                    <button type="submit">新規登録する</button>
                </div>

                {/* 仮URL */}
                {/* <div>
                    <Link href="/">タスク一覧へ戻る</Link>
                </div> */}
            </form>
        </div>
    )
}
