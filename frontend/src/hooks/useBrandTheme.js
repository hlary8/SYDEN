import { useEffect } from 'react';

const themeMap = {
  'DELEON ENTERPRiSES': {
    '--primary': '#0A2F1C',
    '--accent': '#D4AF37',
    '--bg': '#FFFFF0',
    '--text': '#1A1A1A',
    '--surface': '#F7F3E8',
    '--font-heading': 'Playfair Display, serif',
    '--font-body': 'Inter, sans-serif'
  },
  syden: {
    '--primary': '#87A878',
    '--accent': '#E2725B',
    '--bg': '#FFFDD0',
    '--text': '#2F4F4F',
    '--surface': '#F3E8D2',
    '--font-heading': 'Cormorant Garamond, serif',
    '--font-body': 'Lato, sans-serif'
  },
  deefresh: {
    '--primary': '#FF6347',
    '--accent': '#FFD700',
    '--bg': '#F5FFFA',
    '--text': '#673147',
    '--surface': '#FCF7F4',
    '--font-heading': 'Montserrat, sans-serif',
    '--font-body': 'Open Sans, sans-serif'
  }
};

export default function useBrandTheme(brand) {
  useEffect(() => {
    const root = document.documentElement;
    const theme = themeMap[brand] || themeMap['DELEON ENTERPRiSES'];

    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    return () => {
      Object.keys(theme).forEach((key) => root.style.removeProperty(key));
    };
  }, [brand]);
}
