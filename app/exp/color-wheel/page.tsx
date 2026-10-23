'use client';

import { ExpBackLink } from '@/components/experimental/ExpBackLink';

import { ColorWheel } from '@/components/experimental/ColorWheel';
import { useAppContext } from '@/context/AppProvider';

export default function Page() {
  const { rootColor, handleColorChange } = useAppContext();

  return (
    <>
      <ExpBackLink />
      <div className="flex h-[80vh] flex-col items-start justify-center">
        <ColorWheel
          handleColorChange={handleColorChange}
          className="lg:hidden visible lg:invisible inline-flex text-[40vw] mb-10"
        />
        <h1 className="inline-flex w-full align-baseline flex-wrap font-pixel text-[12vw] leading-[1.1]  whitespace-normal">
          Click The &nbsp;
          <ColorWheel
            handleColorChange={handleColorChange}
            className="max-lg:hidden lg:visible invisible lg:inline-flex"
          />
          Color Wheel {rootColor}
        </h1>
      </div>
    </>
  );
}
