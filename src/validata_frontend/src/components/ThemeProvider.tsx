import React from 'react';
import { useThemeState, ThemeContext } from '../hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeMethods = useThemeState();

  return (
    <ThemeContext.Provider value={themeMethods}>
      {children}
    </ThemeContext.Provider>
  );
};