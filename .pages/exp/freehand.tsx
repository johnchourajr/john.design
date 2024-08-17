import FreehandCanvas from '@/components/experimental/FreehandCanvas';
import InlineLink from '@/components/fragments/InlineLink';

export default function Freehand() {
  return (
    <>
      <InlineLink href="/exp/" className="relative z-50 no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <div className="relative flex items-center justify-start w-full h-[100vh]">
        <p className="fixed bottom-2">Start drawing with your cursor ✎</p>
      </div>
      <FreehandCanvas />
    </>
  );
}
