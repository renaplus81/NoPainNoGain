//タスク一覧
/*　後で編集・削除機能追加します */
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
    params: Promise<{userId: string}>;
};

export default async function TaskList({params}: Props){
    const {userId} = await params;

    const allTasks = await prisma.task.findMany({
        where:{ user_id : Number(userId)},
        orderBy:{ id: "desc" },
    });

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
                            {/* <th>登録したユーザー名</th>　※時間があれば */}
                        </tr>
                    </thead>

                    <tbody>
                        {allTasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.task_name}</td>
                                <td>{task.duration}</td>
                                <td>{task.irrational}</td>
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