import { NavColorOverlay } from '@/components/globals/Header/NavColorOverlay';
import { setRootColor } from '@/lib/utils/slugify';
import React, { createContext, useContext, useState } from 'react';

type AppContextType = {
  toggleColorActive: boolean;
  setToggleColorActive: (value: boolean) => void;
  handleActive: (state: boolean) => void;
  handleColorChange: (e: any) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useDrawing must be used within a DrawingProvider');
  }
  return context;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [toggleColorActive, setToggleColorActive] = useState(false);

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

  return (
    <AppContext.Provider
      value={{
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
