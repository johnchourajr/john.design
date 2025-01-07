'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import { SETTINGS } from '@/components/experimental/JohnGL';

const JohnGLCanvas = dynamic(
  () =>
    import('@/components/experimental/JohnGL').then((mod) => mod.JohnGLCanvas),
  { ssr: false },
);

const SettingsGroup = dynamic(
  () =>
    import('@/components/experimental/SettingsComponents').then(
      (mod) => mod.SettingsGroup,
    ),
  { ssr: false },
);

const InlineLink = dynamic(() => import('@/components/fragments/InlineLink'), {
  ssr: false,
});

export default function JohnGL() {
  const [settings, setSettings] = React.useState(SETTINGS);

  return (
    <>
      <InlineLink href="/exp/" className="no-underline" underline={false}>
        <h2 className="my-8">
          &larr; <span>Back</span>
        </h2>
      </InlineLink>
      <JohnGLCanvas settings={settings} className="h-[150vw] md:h-[100vw]" />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
