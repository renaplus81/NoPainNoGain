import {prisma} from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";


type ParamPageProps = {
   params: Promise<{id: string}>
};


export default async function StartPage({params}: ParamPageProps){
   const {id} = await params;

   //findmanyだと複数件取得するため[]で帰ってきてしまうが、uniqueの場合は一件取得のためオブジェクトかnullで返してくれる
   const user = await prisma.user.findUnique({
        where:{
            id:Number(id)
        },
        include:{
            // リレーションの自分で決めた名前
            playerstask: true,
        },
    });

    
    if(!user) notFound();



   return (
    <div>
        <p>ここなんかかくん</p>
        <Link href="/login">
        ログイン画面に戻る
        </Link>

        <h1>{user?.user_name}</h1>

        <section>
            <h2>スタート画面</h2>
            <table>
                <tbody>
                    <tr>
                        <th>ユーザー名</th>
                        <td>{user?.user_name}</td>
                    </tr>

                    {/* .mapは配列にしか使えないオブジェクト */}
                    {user.playerstask.map((playerstask) =>(
                        //key忘れていた
                    <tr key={playerstask.id}>
                        <td>{playerstask.task_name}</td>
                    </tr>
                    )
                    )}
                </tbody>
            </table>
        </section>
   </div>
   );
}
