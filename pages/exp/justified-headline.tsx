import Link from "next/link";

export default function JustifiedHeadlien() {
  return (
    <>
      <Link href="/exp/" className="">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </Link>
      <div className="relative flex items-center justify-start w-full h-[100vh]">
        <p></p>
      </div>
    </>
  );
}
