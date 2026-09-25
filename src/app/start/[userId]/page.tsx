import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";


type ParamPageProps = {
   params: Promise<{userId: string}>
};


export default async function StartPage({params}: ParamPageProps){

   const {userId} = await params;

    //ユーザーidを取得しているserver action

    //findmanyだと複数件取得するため[]で帰ってきてしまうが、uniqueの場合は一件取得のためオブジェクトかnullで返してくれる
    const user = await prisma.user.findUnique({
            where:{
                id: Number(userId)
            },
            //includeなんだっけな→
            //関連するテーブルを一緒に取得する
            include:{
                // リレーションの自分で決めた名前
                playerstask: true,
            },
        });
        
        if(!user) notFound();



        //ゲーム開始のserver action(上で取得したユーザーのidを利用してステータスを変更)

        //useIdはすでにStartPageで取得済みのため、{params: ParamPageProps}しなくてもいいとのこと。
        // async function gamePlay({params: ParamPageProps})
        async function startGamePlay(){
            "use server";

            //gameplayの画面をたくさん開いたら開くたびにgameplayIdが増えていっている
            const gamePlay = await prisma.gamePlay.create({
                data: {
                    user_id: Number(userId),
                    player_status: "プレイ中",
                },
            });
            redirect(`/gameplay/${gamePlay.id}`);
        }

       


   return (
    <div>
        <div>
            <p>tst</p>
        </div>

        <div>
            <Link href={`/login`}>
            ログイン画面に戻る
            </Link>
        </div>


        <h1>{user?.user_name}</h1>

        <section>
            <h2>スタート画面</h2>
            <table>
                <tbody>
                    <tr>
                        <th>ユーザー名</th>
                        <td>{user?.user_name}</td>
                    </tr>

                    {/* ここよくわからない */}
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

        {/* redirectがstartGamePlay関数の中にあるので、Linkタグではない。
        submitでcreateしたgameplayをredirect先に送っている？ 
        →少し違うらしい
        redirect 関数自体が、ブラウザに次にどのURLへ移動してほしいかを指示している*/}
        <form action={startGamePlay}>
            <button type="submit">ゲームを開始する</button>
        </form>

        <div>
            <Link href={`/addtask/${userId}`}>タスクを追加する</Link>
        </div>
   </div>
   );
}
