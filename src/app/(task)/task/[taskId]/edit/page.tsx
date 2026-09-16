//タスク編集画面

import {prisma} from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

type Props = {
    params: Promise<{taskId : string}>;
};

export default async function TaskEditPage({params}: Props){
    const {taskId} = await params;

    /*違かった
    finduniqueからのupdateっぽい、テキスト参照*/
    // const book = await prisma.task.create({
    //     data:{

    //     }
    // })

    const task = await prisma.task.findUnique({
        where:{ id: Number(taskId)},
    });

    console.log(task);

    //これがなぜ必要なのか
    //defaultValue={task.task_name}に使っている
    //task.task_namがnullの可能性があるものを直接使おうとしているから(findUniqueだし)
    if(!task) notFound();


    async function updateTask(formData: FormData){
        "use server";

        //ここでnullならもう処理は止まっているとTSが理解して、それ以下のコードではtaskが
        //絶対にnullではないと判断してくれるようになる
        // redirect(`/alltask/${task.user_id}`);のtaskがエラーだったため　(1こうえのnotfoundで説明)
        if(!task) notFound();

        //多分useridも撮らなくちゃいけないけどどうしよう
        const id = Number(taskId);
        const task_name = formData.get("task_name") as string;
        const duration = Number(formData.get("duration"));
        const irrational = Number(formData.get("irrational"));
        // //これあってるかね → タスクを編集する時、このタスクが誰のものかという情報は(user_id)は変わらないので要らない
        //task変数は user_idはすでにDBから取得済みの、１件のタスクデータから来ている

        // const user_id = Number(formData.get("user_id"));

        await prisma.task.update({
            where:{ id: Number(taskId)},
            data:{
                task_name,
                duration,
                irrational,
            },
        });

        //エラーでてmす
        //userIdつけたいのに、無理だー多分上でやるんだろうな
        redirect(`/alltask/${task.user_id}`);
    }

    return(
        <div>
            <Link href={`/alltask`}>
            タスク一覧に戻る
            </Link>

            <h1>タスクを編集</h1>

            <form action={updateTask}>
                <div>
                    <label>タスク名: </label>
                    <input 
                    name="task_name" 
                    required
                    defaultValue={task.task_name}
                    />
                </div>

                <div>
                    <label>タスク所要時間: </label>
                    <input
                    name="duration"
                    required
                    defaultValue={task.duration}
                    />
                </div>

                <div>
                    <label>理不尽度: </label>
                    <input
                    name="irrational"
                    required
                    defaultValue={task.irrational}
                    />
                </div>


                <div>
                    <button
                    type="submit"
                    >
                        更新する
                    </button>
                </div>
                {/*  */}
                <Link href={`/alltask/${task.user_id}`}>キャンセル</Link>
            </form>
        </div>
    );
}