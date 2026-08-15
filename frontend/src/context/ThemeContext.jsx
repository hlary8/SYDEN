import { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  'DELEON ENTERPRiSES': {
    primary: '#0A2F1C',
    accent: '#D4AF37',
    light: '#FFFFF0',
    dark: '#1A1A1A',
    headingFont: 'font-playfair',
    bodyFont: 'font-inter'
  },
  syden: {
    primary: '#87A878',
    accent: '#E2725B',
    light: '#FFFDD0',
    dark: '#2F4F4F',
    headingFont: 'font-cormorant',
    bodyFont: 'font-lato'
  },
  deefresh: {
    primary: '#FF6347',
    accent: '#FFD700',
    light: '#F5FFFA',
    dark: '#673147',
    headingFont: 'font-montserrat',
    bodyFont: 'font-opensans'
  }
};

function themeReducer(state, action) {
  switch (action.type) {
    case 'SET_BRAND':
      return { ...state, brand: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, {
    brand: 'DELEON ENTERPRiSES',
    darkMode: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      const { brand, darkMode } = JSON.parse(saved);
      dispatch({ type: 'SET_BRAND', payload: brand });
      if (darkMode) dispatch({ type: 'TOGGLE_DARK_MODE' });
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      if (!prefersLight) dispatch({ type: 'TOGGLE_DARK_MODE' });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify({ brand: state.brand, darkMode: state.darkMode }));
  }, [state]);

  return (
    <ThemeContext.Provider value={{ ...state, dispatch, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
