import LinkGridItem, { LinkGridItemProps } from "../components/LinkGridItem";
import { JohnGLCanvas } from "./exp/john-gl";
import { JustifiedHeadlineInner } from "./exp/justified-headline";

export default function HomePage() {
  return (
    <>
      <section
        id="hero"
        className="flex items-center justify- relative z-0 h-[100vh]"
      >
        <div className="flex self-start w-[100vw] !pointer-events-none">
          <JustifiedHeadlineInner
            headline={[
              { text: "John Is" },
              { text: "Working On" },
              { text: "The *Internet*" },
            ]}
          />
        </div>
        <JohnGLCanvas />
      </section>
    </>
  );
}
