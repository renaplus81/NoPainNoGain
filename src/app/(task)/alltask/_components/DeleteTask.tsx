//ここに必要なのは削除したいタスクのidです
//今回は自分にとってわかりやすいものにするために、deleteコンポーネントを別で作成しました。

//page.tsx側でdeleteTaskというserveraction自体を作り、それをpropsとして渡してあげる必要がある

//このコンポーネントは外から何を受け取るか
type Props = {
    taskId: number;
    deleteAction: (formData:FormData) => Promise<void>;
};

export default function DeleteTask({taskId, deleteAction}: Props){
    return(
        <form action={deleteAction}>
            <input type="hidden" name="taskId" value={taskId} />
            <button type="submit">削除</button>
        </form>
    );
}