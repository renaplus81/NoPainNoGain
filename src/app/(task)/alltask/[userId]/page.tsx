//タスク一覧
/*　後で編集・削除機能追加します */
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteTask from "../_components/DeleteTask";

type Props = {
    params: Promise<{userId: string}>;
};

export default async function TaskList({params}: Props){
    const {userId} = await params;

    //読み込みアシンク
    const allTasks = await prisma.task.findMany({
        where:{ user_id : Number(userId)},
        orderBy:{ id: "desc" },
    });

    //削除アシンク
    async function deleteTask(formData: FormData){
        "use server"

        // if(!task) notFound();

        const taskId = Number(formData.get("taskId"));

        await prisma.task.delete({
            where: {id: taskId},
        });
        redirect(`/alltask/${userId}`);
    }



    return (
        <div>
            <h1>タスク一覧</h1>

        <div>
            <button>
                <Link href={`/addtask/${userId}`}>タスクを新しく作る</Link>
            </button>
        </div>

            {allTasks.length === 0 ? (
                <p>タスクが登録されていません</p>
            ):(
                <table>
                    <thead>
                        <tr>
                            <th>タスク名</th>
                            <th>所要時間</th>
                            <th>理不尽度</th>
                            <th>編集</th>
                            {/* <th>登録したユーザー名</th>　※時間があれば */}
                        </tr>
                    </thead>

                    <tbody>
                        {allTasks.map((task) => (
                            <tr key={task.id}>
               
                                    <td>{task.task_name}</td>
                                
                                    <td>{task.duration}</td>
                                   
                                    <td>{task.irrational}</td> 

                                    <td>
                                    <DeleteTask taskId={task.id} deleteAction={deleteTask}/>
                                    </td>

                                    {/* <td>
                                    <Link href={``}>削除</Link>
                                    </td> */}
                                    
                                    <td>
                            {/* .表の各行(それぞれの違うタスク)に対して、"その行自身”のidを使って
                                        リンク先を区別する必要があるため、task.　が必要
                                        ※ 　.mapはそのための仕組みを提供している。　　*/}
                                    <Link href={`/task/${task.id}/edit`}>編集</Link>
                                    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )} 

            <p>現在{allTasks.length}件  のタスクが登録されています。</p>
            
            <div>
                {/* まだ作成していないのでリンク名は仮 */}
                <Link href={`/gameplay/${userId}`}>ゲームをプレイする</Link>
            </div>

        </div>
    );
}