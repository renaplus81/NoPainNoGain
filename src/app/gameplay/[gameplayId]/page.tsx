import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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

    //gameplay画面開けているかどうかの確認。
     console.log(gameplay);

    //uniqueなのでもしない場合に、gameplayが作られていないことをお知らせ
    //nullの可能性があるものを直接使おうとして今後何かしらエラーが発生しないように。
    if(!gameplay) notFound();



}