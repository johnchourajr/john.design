'use client';

import { NavColorOverlay } from '@/components/globals/Header/NavColorOverlay';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AppContextType = {
  rootColor: string;
  setRootColor: (value: string) => void;
  toggleColorActive: boolean;
  setToggleColorActive: (value: boolean) => void;
  handleActive: (state: boolean) => void;
  handleColorChange: (e: any) => void;
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
  const [rootColor, setRootColor] = useState('#ff0000');

  const handleColorChange = (e: any) => {
    const colorFromSVG = e.target.getAttribute('fill');
    if (colorFromSVG === null || colorFromSVG === 'none') {
      setRootColor('#ff0000');
    } else {
      setRootColor(colorFromSVG);
    }
  };

  const handleActive = (state: boolean) => {
    setToggleColorActive(state);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--root-color', rootColor);
    document.documentElement.setAttribute('data-color', rootColor);
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
