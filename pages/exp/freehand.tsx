import Link from "next/link";
import FreehandCanvas from "../../components/FreehandCanvas";

export default function Freehand() {
  return (
    <>
      <Link href="/exp/" className="relative z-50 ">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </Link>
      <div className="relative flex items-center justify-start w-full h-[100vh]">
        <p className="fixed bottom-2">Start drawing with your cursor ✎</p>
      </div>
      <FreehandCanvas />
    </>
  );
}
