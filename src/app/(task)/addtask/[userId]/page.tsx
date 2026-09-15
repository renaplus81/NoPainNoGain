import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";
import Link from"next/link";

//タスクの新規追加

type Props = {
    params: Promise<{ userId: string }>;
};

export default function RegisterNewTask({params}:Props){

    async function RegisterTask(formData:FormData){
        "use server";
        const { userId } = await params;

        //paramsからとったuserIdがあるので、それを使う。
        const user_id = Number(userId);
        //as stringは、ある値が確実に文字列(string)型であることをコンパイラに保証するため
        const task_name = formData.get("task_name") as string;
        //Number()を追加、フォーム入力のものは文字列型で返ってくるため
        const duration = Number(formData.get("duration") as string);
        const irrational = Number(formData.get("irrational") as string);

        const makesureTitle = await prisma.task.findFirst({
            where:{ 
                task_name: task_name,
            },
        });

        if(makesureTitle){
            redirect(`/alltask`)
            //　まだタスク編集画面一覧を作っていないため一旦仮のURL →OK
        }

        const createTask = await prisma.task.create({
            data:{ 
                user_id,
                task_name,
                duration,
                irrational, 
            },
        });

        //仮URL
        redirect(`/alltask`)
            //　まだタスク編集画面一覧を作っていないため一旦仮のURL →OK
    }

    return (
        <div>
            <Link href="/">
            {/* まだタスク編集画面一覧を作っていないため一旦仮のURL */}
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
