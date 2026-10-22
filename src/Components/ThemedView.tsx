// src/Components/ThemedView.tsx
import { View, type ViewProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../Hooks/useThemeColors';

type ThemedViewProps = ViewProps & {
  background?: 'background' | 'cardBackground' | 'primary' | 'secondary';
};

export function ThemedView({ background = 'background', style, ...rest }: ThemedViewProps) {
  const colors = useThemeColors();
  
  const backgroundColors = {
    background: colors.background,
    cardBackground: colors.cardBackground,
    primary: colors.primary,
    secondary: colors.secondary,
  };
  
  return (
    <View
      style={[
        { backgroundColor: backgroundColors[background] },
        style,
      ]}
      {...rest}
    />
  );
}