import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAppSelector } from '../../../../state/configureStore';
import { selectSettings } from '../../../../state/pageSlice';
import { Themes } from '../../../enums/themes';
import { darkTheme, lightTheme } from './theme';

type ThemeMode = Themes;

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: Themes.light,
  toggleMode: () => {}
});

export const ThemeProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(Themes.light);
  const storeSettings = useAppSelector(selectSettings);

  useEffect(() => {
    // Force light mode permanently as requested by the user
    setMode(Themes.light);
  }, [storeSettings]);

  const toggleMode = () => {
    // Disabled dark mode toggle
  };

  const theme = useMemo(() => (mode === Themes.light ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
