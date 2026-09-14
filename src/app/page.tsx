//ここをLanding pageにしたい(/)
import Link from "next/link"

export default function Home() {
  return (
    <>
      <p>一週間生き延びろ</p>
      <Link href="/login" >
        ここをタップ
      </Link>
    </>
  );
}
