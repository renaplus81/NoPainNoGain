import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

type Props = {
    params: Promise<{gameplayId: string}>
};

export default async function GameStart({params}: Props){

    const {gameplayId} = await params;
    const gameplay = await prisma.gamePlay.findUnique({

        //ポイントを画面に表示させるためにtaskをincludeさせました。
        where: {id: Number(gameplayId)},

        include:{
            gameplaydetail:{
                include: {
                    task: true,
                },
            },         
                user:{
                    include:{
                        playerstask: true,
                    },
                },
            },
    });

    //useridがない元々登録されているタスクも表示したいので追加
    const commonTasks = await prisma.task.findMany({
        where: {
            user_id:null
        }
    })


    //gameplay画面開けているかどうかの確認。
    //  console.log(gameplay);
    //[object]の中身を見たい↓
    //  console.log(JSON.stringify(gameplay, null, 2));


    //findUniqueの結果によって処理を止める。
    //uniqueなのでもしない場合に、gameplayが作られていないことをお知らせ
    //nullの可能性があるものを直接使おうとして今後何かしらエラーが発生しないように。
    if(!gameplay) notFound();
    ////////////////////////////ここまで口頭ディフェンス範囲


    //user_idがnullもタスク選択表示させたくて追加
    const allTasks = [...gameplay.user.playerstask, ...commonTasks];







    //ここは、一旦全部のタスクと完了しているタスクを照らし合わせて未着手のものを抽出している。
    //taskが型推論というなら、じゃあtaskに1件もなかったら型推論できないということですか
    const availableTasks = allTasks.filter((task) => {


            const isCompleted = gameplay.gameplaydetail.some(
                (detail) => detail.task_id === task.id
            );

            //falseフィルターかけられたものだけ返す
            return !isCompleted;   
        });

        // console.log(availableTasks)




//フィッシャーイェーツというデータや配列を偏りなく完全にランダムに並び替えるためのアルゴリズム

    //タスクを3つランダムに取り出すためにここでごちゃ混ぜリスト？にしている
    //型指定しました。tasksは上の関数のtaskの型推論を直接参照して、countは単純にnumberにしました.
    function pickRondomTasks(tasks: typeof availableTasks, count:number){
        if(count > tasks.length) {
            count = tasks.length;
        }


        //copyするのは、spliceを使って直接taskの中身をいじってしまうことになるからコピーしないといけない
        //jsの性質として、オブジェクトや配列は参照で渡される、というため
        const copy = [...tasks];
        const result = [];


        //iを0にしているのは、配列が0から始まるから。
        //カウントは何個選ぶかを外から指定するための変数
        for(let i=0;  i<count;  i++){
            const randomIndex = Math.floor(Math.random() * copy.length);
            //.push　配列に末尾1つ以上の新しい要素を追加する
            result.push(copy[randomIndex]);
            //.splice　配列の要素を削除(今回は削除ver)(開始位置, 削除する個数)
            copy.splice(randomIndex, 1);
        }
        return result;
    }




    //上のランダム関数をつかってタスクを表示させる処理
        //ここって引数これだけでcountとか伝わるのかな
        const appearTasks = pickRondomTasks(availableTasks, 3);

        






    //-----selectTask-----selectTask-----selectTask-----selectTask-----//

    //タスクを選択する
    async function selectTask(formData: FormData){
        "use server";


        //ここの関数で使うためにフォームから取り出してるわよ
        const selectedGameplayId = Number(formData.get("gameplay_id"));
        const taskId = Number(formData.get("task_id"));
        const duration = Number(formData.get("duration"));
        const irrational = Number(formData.get("irrational"));


        //currenttimeを取ってくるためのfind
        const currentGameplay = await prisma.gamePlay.findUnique({
            where:{ id: selectedGameplayId},
        })



    //currentGamePlayがないからnullで返します
        if(!currentGameplay){return;}


        //社畜ポイントの合計を計算

        //オールディーテールズ(過去に選んだタスクの記録だけ)
        //残業時間(overtimehours)と理不尽指数計算(irrational: taskテーブルなのでinclude)
        const allDetails = await prisma.gamePlayDetail.findMany({
            where: {gameplay_id: selectedGameplayId},
            include:{task:true,}
        })




        //22時に到達した場合の次の回数(newOvertimeDays)を先に計算
        const newOvertimeDays = currentGameplay.overtime_days + 1;




        //タスク始まりの時間と終わりの時間を計算。
        const startTime = currentGameplay.current_time;
        const endTime = startTime + duration;






        let overtimeHours = 0;

        //1140は19時
        if(startTime >= 1140){
            overtimeHours = duration;
            //19時までの９時間が1140なのでそれを超えたら19時になるのがわかります、
        } else if(endTime > 1140) {
            overtimeHours = endTime - 1140;
        }
    




        //alldetails(配列)の中身を1件ずつみながら社畜ポイントを足し合わせている。
        let totalPoints = 0;
        //detail of allDetails のdetailってここで決めた変数？ofとは。
                //→→配列の中身を1個ずつdetailという名前で取り出しながら繰り返すという構文。(過去の記録を処理するためにループ文を使って取り出している)
        for (const detail of allDetails){
            totalPoints = totalPoints + detail.overtime_hours * detail.task.irrational; 
        }
        //これなんのtotalPointsなんだろう？
                //1個目が過去に選んだタスクの社畜ポイント、これが今回選んだタスクの社畜ポイン戸
        totalPoints = totalPoints + overtimeHours * irrational;


    

        

            //ポイントによって死ぬか生き残るかを決める
                let newStatus = "プレイ中"; //仮にプレイ中とおく(newStatusがエラーになるから(?))

                if(totalPoints >= 100){
                    newStatus = "過労死";
                } else if (endTime >= 1320 && newOvertimeDays >= 5) {
                    newStatus = "クリア";
                }
                //どちらでもなければnewStatusは最初のプレイ中のまま





        //22時で次の日になる計算(🕙1320は22時)
        //追加：22時が5回きたらクリア判定
        if(endTime >= 1320) {

            //移動
            // const newOvertimeDays = currentGameplay.overtime_days + 1;

                //gameplay を更新する(1回だけ)

                await prisma.gamePlay.update({
                    where: {id: selectedGameplayId},
                    data:{
                        current_time: 600,
                        overtime_days: newOvertimeDays,
                        player_status: newStatus,
                    },
                });

                } else {
                    await prisma.gamePlay.update({
                        where:{id: selectedGameplayId},
                        data: {current_time: endTime, player_status: newStatus,},
            
                    });
                }


        





        //gameplayを新規作成する(このタスクを選んだ記録として新しい1行として保存する)
        await prisma.gamePlayDetail.create({
            data: {
                gameplay_id: selectedGameplayId,
                task_id: taskId,
                overtime_hours: overtimeHours,
                when_overtime_happen: new Date(),
            },
        });



        //今のページのパスを呼び出して更新する。(コンポーネント関数の再実行)
        revalidatePath("/gameplay/" + selectedGameplayId);



    }

    //⬆️ここまでselectTaskの関数


    // -----selectTask-----selectTask-----selectTask-----selectTask-----










    //⭐️⭐️⭐️コンソールで確認したくでclaudeに出してもらった
    console.log("現在時刻(分):", gameplay.current_time, "22時到達回数:", gameplay.overtime_days, "ステータス:", gameplay.player_status);


    //画面にトータルポイントを表示させるために、ここに処理を書きました。
    let totalPoints = 0;
    for (const detail of gameplay.gameplaydetail){
        totalPoints = totalPoints + detail.overtime_hours * detail.task.irrational;
    }





    return(
        <div>
            <div>{gameplay.overtime_days + 1}日目の</div>
            <div>社畜ポイント:{totalPoints}</div>


                {gameplay.player_status !== "プレイ中" ? (
                    <div>
                        {gameplay.player_status === "過労死" ? (
                            <p>過労死しましたね</p>
                        ):(
                            <p>クリアしました。</p>
                        
                        )}
                    </div>
                ):(
                        <div>
                            {appearTasks.map((task) => (
                                <form key={task.id} action={selectTask}>
                                    
                                    <input type="hidden" name="gameplay_id" value={gameplay.id}/>
                                    {/* 選択可能な登録タスクが3件未満の場合はここでエラーになります。 */}
                                    <input type="hidden" name="task_id" value={task.id}/>
                                    <input type="hidden" name="duration" value={task.duration}/>
                                    <input type="hidden" name="irrational" value={task.irrational}/>

                                    <span>{task.task_name}</span>
                                    <button type="submit">このタスクを選ぶ</button>
                                    
                                </form>
                                
                            ))}
                        </div>
                )}
            
                {/* <form action={次の日に移動する関数とポイント計算関数？}> */}

        </div>
    );

}