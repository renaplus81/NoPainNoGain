import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {cookies} from "next/headers";


type ParamPageProps = {
   params: Promise<{userId: string}>
};


export default async function StartPage({params}: ParamPageProps){

   const {userId} = await params;

                        //🍪//🍪//🍪//🍪//🍪//🍪//🍪//🍪
                        //クッキーを確認する
                            const cookieStore = await cookies();
                            const loggedInUserId = cookieStore.get("userId")?.value;
                        //クッキーがない、またはURLのuserIdと一致しない場合はログイン画面に戻す
                            if (!loggedInUserId || loggedInUserId !== userId) {
                                redirect("/login");
                            }



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

                            //🍪//🍪//🍪//🍪//🍪//🍪//🍪//🍪
                            //すでにプレイ中のGameplayがないか先に探す
                            const existingGamePlay = await prisma.gamePlay.findFirst({
                                where:{
                                    user_id: Number(userId),
                                    player_status: "プレイ中",
                                },
                            });

                            //あればそれを使い回す
                            if(existingGamePlay){
                                redirect(`/gameplay/${existingGamePlay.id}`);
                            }



                        //⬇️なければ新規作成する処理は元々入っていました〜

            //gameplayの画面をたくさん開いたら開くたびにgameplayIdが増えていっている(→→cookieで解決中)
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
