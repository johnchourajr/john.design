'use client';

import { ColorWheelControl } from '@/components/experimental/ColorWheel';
import { NavDateTime } from '@/components/globals/Header/NavDateTime';
import { NavDrawingControls } from '@/components/globals/Header/NavDrawingControls';
import { useIsProposalDetail } from '@/hooks/useIsProposalDetail';

export function NavRight() {
  const isProposalDetail = useIsProposalDetail();

  return (
    <div className="hidden md:inline-flex row gap-6 items-center h-5">
      {!isProposalDetail && <NavDrawingControls />}
      {!isProposalDetail && <ColorWheelControl />}
      <NavDateTime />
    </div>
  );
}
