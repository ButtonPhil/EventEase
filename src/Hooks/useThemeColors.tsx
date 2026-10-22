import { useColorScheme } from 'react-native';
import { Colors } from '../Constants/colors';
import { useStore } from '../Store/useStore';
import { useState, useEffect } from 'react';

export function useThemeColors() {
  const systemColorScheme = useColorScheme();
  const userTheme = useStore((state) => state.theme);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const theme = userTheme === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light') 
      : userTheme;
    setActiveTheme(theme);
  }, [userTheme, systemColorScheme]);

  return Colors[activeTheme];
}

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const userTheme = useStore((state) => state.theme);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const theme = userTheme === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light') 
      : userTheme;
    setActiveTheme(theme);
  }, [userTheme, systemColorScheme]);

  return activeTheme;
}