'use client';

import { NavColorOverlay } from '@/components/globals/Header/NavColorOverlay';
import {
  DEFAULT_ROOT_COLOR,
  ROOT_COLOR_COOKIE_NAME,
  resolveThemeColor,
} from '@/lib/theme/theme-config';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AppContextType = {
  rootColor: string;
  setRootColor: (value: string) => void;
  toggleColorActive: boolean;
  setToggleColorActive: (value: boolean) => void;
  handleActive: (state: boolean) => void;
  handleColorChange: (e: React.MouseEvent<HTMLElement>) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useDrawing must be used within a AppProvider');
  }
  return context;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [toggleColorActive, setToggleColorActive] = useState(false);
  const [rootColor, setRootColor] = useState(() => {
    if (typeof document === 'undefined') {
      return DEFAULT_ROOT_COLOR;
    }

    const cssValue = getComputedStyle(document.documentElement).getPropertyValue(
      '--root-color',
    );
    return resolveThemeColor(DEFAULT_ROOT_COLOR, cssValue);
  });

  const handleColorChange = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target;
    const colorFromSVG =
      target instanceof Element ? target.getAttribute('fill') : null;
    setRootColor(resolveThemeColor(DEFAULT_ROOT_COLOR, colorFromSVG));
  };

  const handleActive = (state: boolean) => {
    setToggleColorActive(state);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--root-color', rootColor);
    document.documentElement.setAttribute('data-color', rootColor);
    document.cookie = `${ROOT_COLOR_COOKIE_NAME}=${encodeURIComponent(rootColor)}; path=/; max-age=31536000; SameSite=Lax`;
  }, [rootColor]);

  return (
    <AppContext.Provider
      value={{
        rootColor,
        setRootColor,
        toggleColorActive,
        setToggleColorActive,
        handleActive,
        handleColorChange,
      }}
    >
      {children}
      <NavColorOverlay />
    </AppContext.Provider>
  );
}
