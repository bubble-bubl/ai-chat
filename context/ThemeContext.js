import React, { createContext, useContext, useState } from 'react';

export const COLORS = {
  light: {
    bg: '#f5f5f5',
    card: '#ffffff',
    border: '#e0e0e0',
    text: '#1a1a1a',
    subtext: '#888888',
    primary: '#e94560',
    userBubble: '#e94560',
    userBubbleText: '#ffffff',
    aiBubble: '#ffffff',
    aiBubbleText: '#1a1a1a',
    inputBg: '#ffffff',
    inputText: '#1a1a1a',
    tabActive: '#e94560',
    tabInactive: '#eeeeee',
    tabTextActive: '#ffffff',
    tabTextInactive: '#888888',
    roundBtnActive: '#e94560',
    roundBtnInactive: '#eeeeee',
    roundBtnTextActive: '#ffffff',
    roundBtnTextInactive: '#888888',
    sideA: '#1565c0',
    sideB: '#b71c1c',
    vsText: '#e94560',
    sideAText: '#1976d2',
    sideBText: '#d32f2f',
    expandedBg: '#f0f0f0',
    hintText: '#aaaaaa',
    scoreValue: '#e94560',
    scoreMax: '#aaaaaa',
    tierBadgeBg: '#ffffff',
    statusBar: 'dark',
  },
  dark: {
    bg: '#1a1a2e',
    card: '#16213e',
    border: '#0f3460',
    text: '#ffffff',
    subtext: '#aaaaaa',
    primary: '#e94560',
    userBubble: '#e94560',
    userBubbleText: '#ffffff',
    aiBubble: '#16213e',
    aiBubbleText: '#ffffff',
    inputBg: '#16213e',
    inputText: '#ffffff',
    tabActive: '#e94560',
    tabInactive: '#16213e',
    tabTextActive: '#ffffff',
    tabTextInactive: '#aaaaaa',
    roundBtnActive: '#e94560',
    roundBtnInactive: '#1a1a2e',
    roundBtnTextActive: '#ffffff',
    roundBtnTextInactive: '#aaaaaa',
    sideA: '#1565c0',
    sideB: '#b71c1c',
    vsText: '#e94560',
    sideAText: '#64b5f6',
    sideBText: '#ef9a9a',
    expandedBg: '#0f3460',
    hintText: '#666666',
    scoreValue: '#e94560',
    scoreMax: '#666666',
    tierBadgeBg: '#16213e',
    statusBar: 'light',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? COLORS.dark : COLORS.light;
  const toggleTheme = () => setIsDark((v) => !v);
  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
