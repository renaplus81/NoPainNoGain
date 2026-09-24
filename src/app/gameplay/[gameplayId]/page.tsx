import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

type Props = {
    params: Promise<{gameplayId: string}>
};

export default async function GameStart({params}: Props){

    const {gameplayId} = await params;

    const gameplay = await prisma.gamePlay.findUnique({
        where: {id: Number(gameplayId)},
        //includeをどうしよう。
        //ゲーム詳細とタスクをjoinさせるべきかな？
        
        include:{
            gameplaydetail: true,

                //間違っていた自分で書いたversion
                // include:{
                //     user:{
                //         include:{
                //             onegame:true,
                //             playerstask: true,
                //         }},
                //     }
                //includeは1つのモデルに対して1つだけ書く！
                
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
     console.log(gameplay);
    //[object]の中身を見たい↓
    //  console.log(JSON.stringify(gameplay, null, 2));


    //uniqueなのでもしない場合に、gameplayが作られていないことをお知らせ
    //nullの可能性があるものを直接使おうとして今後何かしらエラーが発生しないように。
    if(!gameplay) notFound();
    //ここまで口頭ディフェンス範囲


    //nullも表示させたくて追加
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
    //taskとcountがエラーになるのはなんでだろう→型が指定されていないからでした(修正ずみ)
    //→→型指定しました。tasksは上の関数のtaskの型推論を直接参照して、countは単純にnumberにしました
    function pickRondomTasks(tasks: typeof availableTasks, count:number){
        //copyするのは、spliceを使って直接taskの中身をいじっているからコピーしないといけない
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




    //タスクを選択する
    async function selectTask(formData: FormData){
        "use server";


        const selectedGameplayId = Number(formData.get("gameplay_id"));
        const taskId = Number(formData.get("task_id"));
        const duration = Number(formData.get("duration"));

        //currenttimeを取ってくるためのfind
        const currentGameplay = await prisma.gamePlay.findUnique({
            where:{ id: selectedGameplayId},
        })

        //currentGamePlayがないからnullで返します
        if(!currentGameplay){return;}

        const startTime = currentGameplay.current_time;
        const endTime = startTime + duration;

        let overtimeHours = 0;

        if(startTime >= 1140){
            overtimeHours = duration;
            //なんで途中から超えたかどうかがendTime > 1140でわかるの？
        } else if(endTime > 1140) {
            overtimeHours = endTime - 1140;
        }
        
        //最後、終わった時間を表すendをcurrent_timeに入れる
        await prisma.gamePlay.update({
            where:{id: selectedGameplayId},
            data: {current_time: endTime},
        });
        

        await prisma.gamePlayDetail.create({
            data: {
                gameplay_id: selectedGameplayId,
                task_id: taskId,
                overtime_hours: overtimeHours,
                when_overtime_happen: new Date(),
            },
        });

        //今のページのパスを呼び出して更新する。
        revalidatePath("/gameplay/page.tsx" + selectedGameplayId);
    }






    return(
        <div>
            <div>${}日目の</div>

                <div>
                    {appearTasks.map((task) => (
                        <form key={task.id} action={selectTask}>
                            
                            <input type="hidden" name="gameplay_id" value={gameplay.id}/>
                            <input type="hidden" name="task_id" value={task.id}/>
                            <input type="hidden" name="duration" value={task.duration}/>
                            <input type="hidden" name="irrational" value={task.irrational}/>

                            <span>{task.task_name}</span>
                            <button type="submit">このタスクを選ぶ</button>
                            
                        </form>
                        
                    ))}
                </div>
            
                {/* <form action={次の日に移動する関数とポイント計算関数？}> */}


                

        </div>
    );

}