
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center text-center">
      <h1 className="">Quiz app</h1>
      <div className="flex flex-row justify-center align-middle gap-4">
        <Link href="./Quiz">take a quiz</Link>
        <Link href="./Historical">history</Link>
      </div>
    </div>
  );
}
